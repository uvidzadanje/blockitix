import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from 'src/app/shared/models/event';
import { Role } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BlockitixContractService } from 'src/app/shared/services/blockitix-contract.service';
import { EventService } from 'src/app/shared/services/event.service';
import { IPFSService } from 'src/app/shared/services/ipfs.service';
import { environment } from 'src/environments/environment';

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

  constructor(private ipfsService: IPFSService, private blockitixContractService: BlockitixContractService, private eventService: EventService, private route: ActivatedRoute, private router: Router, private authService: AuthService) {

  }

  async ngOnInit(): Promise<void> {
    let id = this.route.snapshot.paramMap.get("id") as string;

    if(!id)
    {
      await this.router.navigate([""]);
      return;
    }

    let event = (await this.eventService.getOneEvent(BigInt(+id)))!;
    this.event = {
      ...event,
      descriptionURL: `${environment.ipfsStorageURL}/${event.descriptionURL}`,
      coverURL: `${environment.ipfsStorageURL}/${event.coverURL}`,
      seatsFormatURL: `${environment.ipfsStorageURL}/${event.seatsFormatURL}`
    }
    console.log(this.event);

    this.description = await (await fetch(this.event.descriptionURL)).text();

    let authInfo = await this.authService.getAuthUser();

    this.isCreator = Number(authInfo?.role) === Role.CREATOR;
    this.isOwner = this.event.owner === authInfo?.address;
  }

  async toggleCancelEvent() {
    await this.eventService.toggleCancelEvent(this.event?.id!);
  }

  goEdit() {
    this.router.navigate([`event/edit/${this.event?.id}`]);
  }
}
