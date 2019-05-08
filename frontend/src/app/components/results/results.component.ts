import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ResultsService } from "../../services/results/results.service";

@Component({
  selector: "results",
  templateUrl: "./results.component.html",
  styleUrls: ["./results.component.css"]
})
export class ResultsComponent implements OnInit {
  public results: Object;
  public headers: string[];
  public commits: string[];

  constructor(private resultsService: ResultsService) {}

  ngOnInit() {
    this.results = this.resultsService.getResults();
    this.headers = this.resultsService.getHeaders();
    this.commits = this.resultsService.getCommits();
    console.log(this.headers);
  }
}
