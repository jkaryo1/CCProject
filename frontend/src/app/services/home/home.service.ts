import { Injectable } from "@angular/core";
import { Info } from "../../models/info";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import * as myGlobals from "../../globals";

@Injectable({
  providedIn: "root"
})
export class HomeService {
  baseUrl = environment.url;
  uploadResult: Object;

  constructor(private http: HttpClient) {}

  upload(model: Info) {
    const params = new HttpParams()
      .set("git_address", model.git_address)
      .set("num_commits", String(model.num_commits))
      .set("bucket_name", myGlobals.source_bucket);
    return this.http.get(this.baseUrl + "/last_commits", { params });
  }

  createAndUploadInput(model: Info) {
    const params = new HttpParams()
      .set("input_size", String(model.input_size))
      .set("bucket_name", myGlobals.source_bucket);
    return this.http.get(this.baseUrl + "/create_and_upload_input", { params });
  }

  getResults(model: Info) {
    const params = new HttpParams()
      .set("bucket_name", myGlobals.target_bucket)
      .set("input_size", String(model.input_size))
      .set("num_commits", String(model.num_commits));
    return this.http.get(this.baseUrl + "/get_results", { params });
  }

  delete_source(bucket_name: string, suffix: string) {
    const params = new HttpParams()
      .set("bucket_name", bucket_name)
      .set("suffix", suffix);
    return this.http.get(this.baseUrl + "/delete_source", { params });
  }

  getHashes(model: Info) {
    const params = new HttpParams()
      .set("git_address", model.git_address)
      .set("num_commits", String(model.num_commits));
    return this.http.get(this.baseUrl + "/get_past_hashes", { params });
  }

  writeToCsv(results, version: string) {
    const params = new HttpParams()
      .set("version", version)
      .set("avg", String(results[0]))
      .set("top", String(results[1]))
      .set("avg_sd", String(results[2]))
      .set("top_sd", String(results[3]));
    console.log(this.http.get(this.baseUrl + "/write_to_csv", { params }))
    return this.http.get(this.baseUrl + "/write_to_csv", { params });
  }
}
