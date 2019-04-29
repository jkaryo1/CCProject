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
  public success: boolean;
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
    this.homeService.upload(this.model).subscribe(
      data => {
        this.notSubmitted = false
        this.loading = true
      },
      error => {
        this.router.navigate(['/error'])
      }
    )
  }
}
