import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { Ticket } from '../models/ticket';
import { BlockitixContractService } from './blockitix-contract.service';
import { Web3Service } from './web3.service';


@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(private blockitixContractService: BlockitixContractService) { }

  async getTakenSeats(eventId: number): Promise<number[] | null>
  {
    return await this.blockitixContractService.execute("getTakenSeats", eventId);
  }

  async getTicketById(ticketId: number)
  {
    return await this.blockitixContractService.execute<Ticket>("getTicketById", ticketId);
  }

  async buyTicket(eventId: number, seat: number, price: number): Promise<void>
  {
    const contract = await this.blockitixContractService.Contract;
    // return await this.web3Service.executeWithOptions("buyTicket", {value: `${price}`}, [eventId, seat]);
    await (contract as any).buyTicket(eventId, seat, {value: `${price}`});

    // await (contract as any).widthdraw(eventId);
  }
}
