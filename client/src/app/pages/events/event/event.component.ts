import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Event } from 'src/app/shared/models/event';
import { EventService } from 'src/app/shared/services/event.service';
import { TicketComponent } from '../../event-show/ticket/ticket.component';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  @Input() event?: Event;
  @Input() isOwner?: boolean;
  @Input() isCreator?: boolean;

  constructor(private dialog: MatDialog, private eventService: EventService, private router: Router) { }

  ngOnInit(): void {

  }

  showTickets()
  {
    this.dialog.open(TicketComponent, {
      data: {
        eventId: this.event?.id,
        totalTickets: this.event?.totalTickets,
        // price: this.event?.price
      }
    })
  }

  async cancelEvent() {
    await this.eventService.cancelEvent(this.event?.id!);
  }

  goEdit() {
    this.router.navigate([`event/edit/${this.event?.id}`]);
  }

}
