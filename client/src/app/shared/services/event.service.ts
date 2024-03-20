import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';

import { EditEvent, Event, SeatType } from '../models/event';
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
    const data = await this.blockitixContractService.execute<Event[]>("getAllEvents");

    return data && data.map(event => this.getCopy(event));
  }

  async getOneEvent(eventId: bigint) : Promise<Event | null>
  {
    const data = await this.blockitixContractService.execute<Event>("getOneEvent", eventId);
    return data && this.getCopy(data);
  }

  async createEvent(event: CreateEvent) : Promise<void>
  {
    let {name, totalTickets, datetime, city, location, seatsFormatURL: seatFormatURL, seatTypes, coverURL, descriptionURL, category} = event;
    return (await this.blockitixContractService.execute(
      "createEvent",
      name,
      totalTickets,
      seatFormatURL,
      datetime,
      city,
      location,
      coverURL,
      descriptionURL,
      category,
      seatTypes.map(seatType => ({...seatType, price: ethers.parseEther(`${seatType.price}`)}))
    ))!;
  }

  async getSeatLayout(eventId: number) : Promise<{seatsFormatURL: string, seatsType: SeatType[]}>
  {
    return (await this.blockitixContractService.execute("getSeatLayout", eventId))!;
  }

  async toggleCancelEvent(eventId: number)
  {
    await this.blockitixContractService.execute("toggleCancelEvent", eventId);
  }

  async editEvent(event: EditEvent)
  {
    await this.blockitixContractService.execute(
      "editEvent",
      event.id,
      event.name,
      event.datetime,
      event.city,
      event.location,
      event.coverURL,
      event.descriptionURL,
      event.category
    )
  }

  private getCopy(event: Event): Event
  {
    return {
      id: event.id,
      name: event.name,
      totalTickets: event.totalTickets,
      remainingTickets: event.remainingTickets,
      owner: event.owner,
      datetime: event.datetime,
      city: event.city,
      location: event.location,
      seatsFormatURL: event.seatsFormatURL,
      isCanceled: event.isCanceled,
      coverURL: event.coverURL,
      descriptionURL: event.descriptionURL,
      category: event.category,
      seatTypes: []
    };
  }

}
