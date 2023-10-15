import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Event } from 'src/app/shared/models/event';
import { TicketComponent } from './ticket/ticket.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  @Input() event?: Event;
  @Input() isOwner?: boolean;
  @Input() isCreator?: boolean;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {

  }

  showTickets()
  {
    this.dialog.open(TicketComponent, {
      data: {
        eventId: this.event?.id,
        totalTickets: this.event?.totalTickets,
        price: this.event?.price
      }
    })
  }

}
