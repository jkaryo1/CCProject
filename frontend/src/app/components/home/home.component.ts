import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home/home.service';
import { Info } from '../../models/info'
import { Router } from "@angular/router"
import * as myGlobals from '../../globals'

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public numbers: number[];
  public notSubmitted: boolean;
  public loading: boolean;
  public results: boolean;
  public temp: boolean; // DELETE
  model = new Info("", null);

  constructor(
    private homeService: HomeService,
    private router: Router) {}

  ngOnInit() {
    // console.log(this.homeService.getHelloWorld())
    this.numbers = Array.from({length: myGlobals.max_commits}, (x,i) => i)
    // this.numbers.shift()
    this.notSubmitted = true
  }

  async onSubmit() {
    this.notSubmitted = false
    this.loading = true
    this.homeService.upload(this.model).subscribe(
      data => {
        this.homeService.getResults(this.model.num_commits).subscribe(
          data => {
            this.results = data;
            this.homeService.delete_source(myGlobals.source_bucket, '.zip').subscribe()
            this.homeService.delete_source(myGlobals.target_bucket, '.json').subscribe()
            this.loading = false
            this.temp = true
          },
          error => {
            this.router.navigate(['/error'])
          }
        )
      },
      error => {
        this.router.navigate(['/error'])
      }
    )
  }
}
