import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';

import { Event } from '../models/event';
import { CreateEvent } from '../dto/createEvent.dto';
import { ethers } from 'ethers';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  event$: Subject<Event> = new Subject<Event>();

  constructor(private web3Service: Web3Service) { }

  async getAllEvents() : Promise<Event[] | null>
  {
    return await this.web3Service.execute<Event[]>("getAllEvents");
  }

  async getOneEvent(eventId: bigint) : Promise<Event | null>
  {
    return await this.web3Service.execute<Event>("getOneEvent", eventId);
  }

  async createEvent(event: CreateEvent) : Promise<void>
  {
    let {name, price, totalTickets, date, time, location} = event;
    return (await this.web3Service.execute(
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
