import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Role, User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BlockitixContractService } from 'src/app/shared/services/blockitix-contract.service';
import { EventService } from 'src/app/shared/services/event.service';
import { StaticDataService } from 'src/app/shared/services/static-data.service';
import { Event } from "../../shared/models/event";
import QRCode from "qrcode";
import { IPFSService } from 'src/app/shared/services/ipfs.service';
import { Stream } from 'stream';
import { WriteStream } from 'fs';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  showCreate() {
    this.router.navigate(['event/create']);
  }

  events: Event[] = [];
  authInfo: User | null = null;
  isCreator: boolean = false;
  cities?: string[];
  eventCategories?: string[];

  filterForm: FormGroup = new FormGroup({
    dateStart: new FormControl(new Date().toISOString().split("T")[0]),
    dateEnd: new FormControl(new Date((new Date().setDate(new Date().getDate() + 7))).toISOString().split("T")[0]),
    city: new FormControl(""),
    eventCategory: new FormControl("")
  })

  constructor(private eventService: EventService, private router: Router, private blockitixContractService: BlockitixContractService, private authService: AuthService, private staticDataService: StaticDataService, private uploadService: IPFSService) { }

  async ngOnInit(): Promise<void> {
    this.cities = (await this.staticDataService.getCities())?.map(city => city.name);
    this.eventCategories = (await this.staticDataService.getEventCategories())?.map(eventCategory => eventCategory.name);
    this.authInfo = await this.authService.getAuthUser();
    this.isCreator = Number(this.authInfo?.role) === Role.CREATOR;

    this.events = (await this.eventService.getAllEvents()) ?? [];

    this.filter();
  }

  async filter()
  {
    this.events = ((await this.eventService.getAllEvents())!).filter(event => (!this.filterForm.value.city || event.city === this.filterForm.value.city) && (!this.filterForm.value.eventCategory || this.filterForm.value.eventCategory === event.category) && new Date(event.datetime) >= new Date(this.filterForm.value.dateStart) && new Date(event.datetime) <= new Date(this.filterForm.value.dateEnd));
  }
}
