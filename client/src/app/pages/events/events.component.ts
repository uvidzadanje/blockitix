import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Role, User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BlockitixContractService } from 'src/app/shared/services/blockitix-contract.service';
import { EventService } from 'src/app/shared/services/event.service';
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
  authInfo: User | null = null;
  isCreator: boolean = false;

  constructor(private eventService: EventService, private dialog: MatDialog, private blockitixContractService: BlockitixContractService, private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    this.authInfo = await this.authService.getUser();
    this.isCreator = Number(this.authInfo?.role) === Role.CREATOR;
    this.eventService.event$.subscribe((event) => {
      this.events = [...this.events, event];
    });

    await this.blockitixContractService.onEvent("EventCreated", async (tx: bigint) => {
      let a = (await this.eventService.getOneEvent(tx))!;
      this.eventService.event$.next(a);
    });

    this.events = (await this.eventService.getAllEvents()) ?? [];
  }
}
