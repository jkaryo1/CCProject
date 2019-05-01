import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  public error: Object

  constructor() { }

  updateError(error) {
    this.error = error
  }

  getError() {
    return this.error
  }
}
