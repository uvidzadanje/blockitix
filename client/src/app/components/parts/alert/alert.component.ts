import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  message: string;
  type: "error" | "success";

  constructor(private dialogRef: MatDialogRef<AlertComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    this.message = data.message;
    this.type = data.type;
  }

  ngOnInit(): void {
  }

  close()
  {
    this.dialogRef.close();
  }
}
