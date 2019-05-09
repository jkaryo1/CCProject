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
  model = new Info("", null);
  total_avg_results: number[] = [];
  total_top_results: number[] = [];
  num_iterations: number = 1

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
  }

  getAvgTimes(data: Object, startStamp: number) {
    console.log(data)
    console.log(startStamp)
    return 0
  }

  ngOnInit() {
    this.model = new Info("https://github.com/LionelEisenberg/CloudComp-Testing.git", 8)
    console.log(this.model)
    for(let i = 0; i < this.num_iterations; i++) {
      const startStamp: number = new Date().getTime();
      this.homeService.upload(this.model).subscribe(
        data => {
          this.homeService.getResults(this.model.num_commits).subscribe(
            data => {
              this.total_avg_results.push(this.getAvgTimes(data, startStamp))
              this.deleteFiles();
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
  }

}
