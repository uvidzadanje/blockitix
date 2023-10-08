import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventService } from 'src/app/shared/services/event.service';
import { Web3Service } from 'src/app/shared/services/web3.service';
import { Event } from "../../shared/models/event";
import { CreateComponent } from './create/create.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent implements OnInit {
  showCreate() {
    this.dialog.open(CreateComponent);
  }

  events: Event[] = [];

  constructor(private eventService: EventService, private dialog: MatDialog, private web3Service: Web3Service) {}

  async ngOnInit(): Promise<void> {
    this.eventService.event$.subscribe((event) => {
      this.events = [...this.events, event];
    });

    await this.web3Service.onEvent("EventCreated", async (tx: bigint) => {
      let a = (await this.eventService.getOneEvent(tx))!;
      this.eventService.event$.next(a);
    });

    this.events = (await this.eventService.getAllEvents()) ?? [];
  }
}
