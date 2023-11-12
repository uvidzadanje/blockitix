import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from 'src/app/shared/models/event';
import { Role } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { EventService } from 'src/app/shared/services/event.service';

@Component({
  selector: 'app-event-show',
  templateUrl: './event-show.component.html',
  styleUrls: ['./event-show.component.css']
})
export class EventShowComponent implements OnInit {
  event?: Event;
  isOwner?: boolean;
  isCreator?: boolean;
  description?: string;

  constructor(private eventService: EventService, private route: ActivatedRoute, private router: Router, private authService: AuthService) {

  }

  async ngOnInit(): Promise<void> {
    let id = this.route.snapshot.paramMap.get("id") as string;

    if(!id)
    {
      await this.router.navigate([""]);
      return;
    }

    this.event = (await this.eventService.getOneEvent(BigInt(+id)))!;
    this.description = await (await fetch(this.event.descriptionURL)).text();

    let authInfo = await this.authService.getAuthUser();

    this.isCreator = Number(authInfo?.role) === Role.CREATOR;
    this.isOwner = this.event.owner === authInfo?.address;
  }

  async cancelEvent() {
    await this.eventService.cancelEvent(this.event?.id!);
    if(this.event)
    {
      this.event.isCanceled = true;
    }
  }

  goEdit() {
    this.router.navigate([`event/edit/${this.event?.id}`]);
  }
}
