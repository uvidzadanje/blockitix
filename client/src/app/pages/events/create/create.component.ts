import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ethers } from 'ethers';
import { CreateEvent } from 'src/app/shared/dto/createEvent.dto';
import { EventService } from 'src/app/shared/services/event.service';
import { Web3Service } from 'src/app/shared/services/web3.service';
import { DateValidator } from 'src/app/shared/validators/date.validator';
import { SeatGeneratorComponent } from '../../seat-generator/seat-generator.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    // price: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    // totalTickets: new FormControl(0, [Validators.required, Validators.min(1), Validators.pattern("^[0-9]*$")]),
    date: new FormControl(new Date().toISOString().split('T')[0], [Validators.required, DateValidator.GreaterThanToday]),
    time: new FormControl(new Date().toISOString().split('T')[1].slice(0, 5), [Validators.required]),
    location: new FormControl('', [Validators.required])
  })

  @ViewChild('generator', { read: SeatGeneratorComponent }) generator?: SeatGeneratorComponent;

  async create() {
    let {name, date, time, location} = this.form.value;
    let { layouts, types } = this.generator!;
    await this.eventService.createEvent({
      name,
      date,
      time,
      location,
      seatTypes: types,
      totalTickets: layouts.reduce((acc, layout) => acc + layout.columns * layout.rows, 0),
      seatFormat: JSON.stringify(layouts),
      isCanceled: false
    });
  }

  constructor(private eventService: EventService) { }

  ngOnInit(): void {

  }

}
