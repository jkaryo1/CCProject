import { Injectable } from '@angular/core';
import { Info } from '../../models/info';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import * as myGlobals from '../../globals'


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  baseUrl = environment.url
  uploadResult: Object;

  constructor(private http: HttpClient) { }

  upload(model: Info) {
    const params = new HttpParams()
      .set('git_address', model.git_address)
      .set('num_commits', String(model.num_commits))
      .set('bucket_name', myGlobals.source_bucket);
    return this.http.get(this.baseUrl + "/last_commits", {params})
  }

  delete_source() {
    const params = new HttpParams()
      .set('bucket_name', myGlobals.source_bucket);
    this.http.get(this.baseUrl + "/delete_source", {params}).subscribe(data => console.log(data));
  }
}
