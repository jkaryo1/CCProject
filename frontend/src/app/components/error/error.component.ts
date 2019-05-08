import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ErrorService } from "../../services/error/error.service";

@Component({
  selector: "app-error",
  templateUrl: "./error.component.html",
  styleUrls: ["./error.component.css"]
})
export class ErrorComponent implements OnInit {
  public error: Object;

  constructor(private errorService: ErrorService) {}

  ngOnInit() {
    this.error = this.errorService.getError();
  }
}
