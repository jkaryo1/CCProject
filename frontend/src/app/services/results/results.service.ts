import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ResultsService {
  public results: Object;
  public commits: string[];
  public headers: string[];
  first: Object;

  constructor() {}

  updateResults(results) {
    this.results = results;
    this.commits = Object.keys(this.results);
    this.first = this.results["0"];
    this.headers = Object.keys(this.first);
  }

  getHeaders() {
    return this.headers;
  }

  getCommits() {
    return this.commits;
  }

  getResults() {
    return this.results;
  }
}
