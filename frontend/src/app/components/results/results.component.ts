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
  public tests: string[];

  constructor(private resultsService: ResultsService) {}

  ngOnInit() {
    this.results = this.resultsService.getResults();
    this.tests = this.resultsService.getTests();
  }
}
