import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ResultsService {
  public results: Object;
  public tests: string[];
  first: Object;
  keys: string[];

  constructor() {}

  updateResults(results) {
    this.results = Object.keys(results).map(function(k) {
      return results[k];
    });
    this.first = this.results[0];
    this.tests = Object.keys(this.first);
    this.tests.splice(0, 1);
    this.tests.splice(this.tests.length - 2, 2);
    console.log(this.tests);
  }

  getTests() {
    return this.tests;
  }

  getResults() {
    return this.results;
  }
}
