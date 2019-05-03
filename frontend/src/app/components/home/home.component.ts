import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home/home.service';
import { Info } from '../../models/info'
import { Router } from "@angular/router"
import { ErrorService } from '../../services/error/error.service'
import * as myGlobals from '../../globals'

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  numbers: number[];
  notSubmitted: boolean;
  loading: boolean;
  results: Object;
  temp: boolean; // DELETE
  model = new Info("", null);

  constructor(
    private homeService: HomeService,
    private errorService: ErrorService,
    private router: Router) {}

  ngOnInit() {
    // console.log(this.homeService.getHelloWorld())
    this.numbers = Array.from({length: myGlobals.max_commits}, (x,i) => i)
    // this.numbers.shift()
    this.notSubmitted = true
  }

  add_duration(startStamp: number) {
    for (var i = 0; i < this.model.num_commits; i++) {
      const endStamp = Date.parse(this.results[i]["TIMESTAMP"]);
      // this.results[i]["duration"] = (Math.round((endStamp - startStamp) / 1000))
      this.results[i]["duration"] = (endStamp - startStamp) / 1000
    }
  }

  async onSubmit() {
    this.notSubmitted = false
    this.loading = true
    const startStamp: number = new Date().getTime();
    this.homeService.upload(this.model).subscribe(
      data => {
        this.homeService.getResults(this.model.num_commits).subscribe(
          data => {
            this.results = data;
            this.homeService.delete_source(myGlobals.source_bucket, '.zip').subscribe()
            this.homeService.delete_source(myGlobals.target_bucket, '.json').subscribe()
            this.loading = false
            this.add_duration(startStamp);
            this.temp = true
          },
          error => {
            this.errorService.updateError(error)
            this.router.navigate(['/error'])
          }
        )
      },
      error => {
        this.errorService.updateError(error)
        this.router.navigate(['/error'])
      }
    )
  }
}
