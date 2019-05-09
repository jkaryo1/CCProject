import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home/home.service'
import { Info } from '../../models/info'
import * as myGlobals from "../../globals";

@Component({
  selector: 'app-benchmark',
  templateUrl: './benchmark.component.html',
  styleUrls: ['./benchmark.component.css']
})
export class BenchmarkComponent implements OnInit {
  model = new Info("", null, null);
  total_avg_results: number[] = [];
  total_top_results: number[] = [];
  avg: number;
  top: number;
  num_iterations: number = 2;
  num_commits: number = 5;
  input_size: number = 100;

  constructor(
    private homeService: HomeService
  ) {}

  deleteFiles() {
    this.homeService
      .delete_source(myGlobals.source_bucket, ".zip")
      .subscribe();
    this.homeService
      .delete_source(myGlobals.target_bucket, ".json")
      .subscribe();
    this.homeService
      .delete_source(myGlobals.source_bucket, "0")
      .subscribe();
  }

  getAvgTimes(data: Object, startStamp: number) {
    let duration = 0;
    for (var i = 0; i < this.model.num_commits; i++) {
      const endStamp = Date.parse(data[i]["TIMESTAMP"]);
      duration += (endStamp - startStamp) / 1000;
    }
  return duration / this.model.num_commits
  }

  getTopTimes(data: Object, startStamp: number) {
    let max = -10000;
    for (var i = 0; i < this.model.num_commits; i++) {
      const endStamp = Date.parse(data[i]["TIMESTAMP"]);
      const duration = (endStamp - startStamp) / 1000;
      if (duration > max) {
        max = duration
      }
    }
    return max
  }

  ngOnInit() {
    this.model = new Info("https://github.com/LionelEisenberg/CloudComp-Testing.git"
    , this.num_commits, this.input_size)
  }

  startBenchmark() {
    console.log(this.model)
    let loop = (num: number) => {
      this.homeService.createAndUploadInput(this.model).subscribe(
        data => {
          const startStamp: number = new Date().getTime();
          this.homeService.upload(this.model).subscribe(
            data => {
              this.homeService.getResults(this.model.num_commits).subscribe(
                data => {
                  this.total_avg_results.push(this.getAvgTimes(data, startStamp))
                  this.total_top_results.push(this.getTopTimes(data, startStamp))
                  this.deleteFiles();
                  if (num > 1) {
                    setTimeout(()=>{loop(num-1)}, 10000)
                  }
                  else {
                    const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
                    this.avg = average(this.total_avg_results);
                    this.top = average(this.total_top_results)
                    console.log(this.avg)
                    console.log(this.top)
                    console.log(this.total_avg_results)
                    console.log(this.total_top_results)
                  }
                },
                error => {
                  this.deleteFiles();
                }
              );
            },
            error => {
              this.deleteFiles();
            }
          );
        }
      )
    }
    loop(this.num_iterations)
  }
}
