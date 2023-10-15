import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';

import { Event } from '../models/event';
import { CreateEvent } from '../dto/createEvent.dto';
import { ethers } from 'ethers';
import { Subject } from 'rxjs';
import { BlockitixContractService } from './blockitix-contract.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  event$: Subject<Event> = new Subject<Event>();

  constructor(private blockitixContractService: BlockitixContractService) { }

  async getAllEvents() : Promise<Event[] | null>
  {
    return await this.blockitixContractService.execute<Event[]>("getAllEvents");
  }

  async getOneEvent(eventId: bigint) : Promise<Event | null>
  {
    return await this.blockitixContractService.execute<Event>("getOneEvent", eventId);
  }

  async createEvent(event: CreateEvent) : Promise<void>
  {
    let {name, price, totalTickets, date, time, location} = event;
    return (await this.blockitixContractService.execute(
      "createEvent",
      name,
      ethers.parseEther(`${price}`),
      totalTickets,
      date,
      time,
      location
    ))!;
  }
}
