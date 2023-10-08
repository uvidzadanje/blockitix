import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CreateEvent } from 'src/app/shared/dto/createEvent.dto';
import { EventService } from 'src/app/shared/services/event.service';
import { Web3Service } from 'src/app/shared/services/web3.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    totalTickets: new FormControl(0, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]),
    date: new FormControl(new Date(), [Validators.required]),
    time: new FormControl(new Date().getTime(), [Validators.required]),
    location: new FormControl('', [Validators.required])
  })

  async create() {
    await this.eventService.createEvent(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

  constructor(private dialogRef: MatDialogRef<CreateComponent>, private eventService: EventService, private web3Service: Web3Service) { }

  ngOnInit(): void {

  }

}
