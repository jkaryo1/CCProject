import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ResultsService {
  public results: Object;

  constructor() {}

  updateResults(results) {
    this.results = results;
  }

  getResults() {
    return this.results;
  }
}
