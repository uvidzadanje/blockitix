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
    return await this.blockitixContractService.execute<Event[]>("getAllEvents");
  }

  async getOneEvent(eventId: bigint) : Promise<Event | null>
  {
    return await this.blockitixContractService.execute<Event>("getOneEvent", eventId);
  }

  async createEvent(event: CreateEvent) : Promise<void>
  {
    let {name, totalTickets, datetime, city, location, seatFormat, seatTypes, coverURL, descriptionURL, category} = event;
    return (await this.blockitixContractService.execute(
      "createEvent",
      name,
      totalTickets,
      seatFormat,
      datetime,
      city,
      location,
      coverURL,
      descriptionURL,
      category,
      seatTypes.map(seatType => ({...seatType, price: ethers.parseEther(`${seatType.price}`)}))
    ))!;
  }

  async getSeatLayout(eventId: number) : Promise<{seatsFormat: string, seatsType: SeatType[]}>
  {
    return (await this.blockitixContractService.execute("getSeatLayout", eventId))!;
  }

  async cancelEvent(eventId: number)
  {
    await this.blockitixContractService.execute("cancelEvent", eventId);
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

}
