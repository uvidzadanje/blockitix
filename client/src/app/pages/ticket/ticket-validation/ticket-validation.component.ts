import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Event } from 'src/app/shared/models/event';
import { Ticket } from 'src/app/shared/models/ticket';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EventService } from 'src/app/shared/services/event.service';
import { TicketService } from 'src/app/shared/services/ticket.service';

@Component({
  selector: 'app-ticket-validation',
  templateUrl: './ticket-validation.component.html',
  styleUrls: ['./ticket-validation.component.css']
})
export class TicketValidationComponent implements OnInit {
  event?: Event;
  ticket?: Ticket | null;
  user?: User;
  layout?: string;
  row?: number;
  column?: number;

  constructor(private ticketService: TicketService, private eventService: EventService, private route: ActivatedRoute, private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    let ticketId = +(this.route.snapshot.paramMap.get("id") as string);
    this.ticket = (await this.ticketService.getTicketById(ticketId))!;
    let [layout, row, column] = this.ticket.seatFormat.split(";");
    this.layout = layout;
    this.row = +row+1;
    this.column = +column+1;
    if(this.ticket.id)
    {
      this.event = (await this.eventService.getOneEvent(BigInt(this.ticket.eventId)))!;
      this.user = (await this.authService.getUser(this.ticket.owner))!;
    }
  }

}
