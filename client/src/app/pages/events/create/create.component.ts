import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ethers } from 'ethers';
import { CreateEvent } from 'src/app/shared/dto/createEvent.dto';
import { EventService } from 'src/app/shared/services/event.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Web3Service } from 'src/app/shared/services/web3.service';
import { DateValidator } from 'src/app/shared/validators/date.validator';
import { environment } from 'src/environments/environment';
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
    location: new FormControl('', [Validators.required]),
    cover: new FormControl(null, [Validators.required])
  })

  coverImageSrc?: string;

  @ViewChild('generator', { read: SeatGeneratorComponent }) generator?: SeatGeneratorComponent;

  async create() {
    let {name, date, time, location, cover} = this.form.value;
    let { layouts, types } = this.generator!;
    await this.eventService.createEvent({
      name,
      date,
      time,
      location,
      seatTypes: types,
      totalTickets: layouts.reduce((acc, layout) => acc + layout.columns * layout.rows, 0),
      seatFormat: JSON.stringify(layouts),
      isCanceled: false,
      coverURL: `${environment.ipfsStorageURL}/${await this.uploadService.upload(cover)}`
    });
  }

  constructor(private eventService: EventService, private uploadService: UploadService) { }

  ngOnInit(): void {

  }

  onFileChange(event: Event) {
    let file = (event.target as HTMLInputElement).files![0];

    const reader = new FileReader();

    reader.onload = (e) => this.coverImageSrc = (reader.result as string);

    reader.readAsDataURL(file);

    this.form.patchValue({cover: file});
  }

}
