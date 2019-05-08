import { Component, OnInit } from "@angular/core";
import { HomeService } from "../../services/home/home.service";
import { Info } from "../../models/info";
import { Router } from "@angular/router";
import { ErrorService } from "../../services/error/error.service";
import { ResultsService } from "../../services/results/results.service";
import * as myGlobals from "../../globals";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  numbers: number[];
  notSubmitted: boolean;
  loading: boolean;
  results: Object;
  model = new Info("", null);

  constructor(
    private homeService: HomeService,
    private errorService: ErrorService,
    private resultsService: ResultsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.numbers = Array.from({ length: myGlobals.max_commits }, (x, i) => i);
    this.numbers.shift()
    this.notSubmitted = true;
    this.loading = false;
  }

  add_duration(startStamp: number) {
    for (var i = 0; i < this.model.num_commits; i++) {
      const endStamp = Date.parse(this.results[i]["TIMESTAMP"]);
      // this.results[i]["duration"] = (Math.round((endStamp - startStamp) / 1000))
      this.results[i]["duration"] = (endStamp - startStamp) / 1000;
    }
  }

  add_hashes(hashes: Object) {
    for (var i = 0; i < this.model.num_commits; i++) {
      const endStamp = Date.parse(this.results[i]["TIMESTAMP"]);
      // this.results[i]["duration"] = (Math.round((endStamp - startStamp) / 1000))
      this.results[i]["hash"] = hashes[i];
    }
  }

  deleteFiles() {
    this.homeService
      .delete_source(myGlobals.source_bucket, ".zip")
      .subscribe();
    this.homeService
      .delete_source(myGlobals.target_bucket, ".json")
      .subscribe();
  }

  async onSubmit() {
    this.notSubmitted = false;
    this.loading = true;
    const startStamp: number = new Date().getTime();
    this.homeService.upload(this.model).subscribe(
      data => {
        this.homeService.getResults(this.model.num_commits).subscribe(
          data => {
            this.results = data;
            this.deleteFiles()
            this.add_duration(startStamp);
            this.homeService.getHashes(this.model).subscribe(data => {
              this.add_hashes(data);
              this.resultsService.updateResults(this.results);
              this.router.navigate(["/results"]);
            });
          },
          error => {
            this.deleteFiles()
            this.errorService.updateError(error);
            this.router.navigate(["/error"]);
          }
        );
      },
      error => {
        this.errorService.updateError(error);
        this.router.navigate(["/error"]);
      }
    );
  }
}
