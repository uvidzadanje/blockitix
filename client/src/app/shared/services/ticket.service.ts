import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import { Ticket } from '../models/ticket';
import { Web3Service } from './web3.service';


@Injectable({
  providedIn: 'root'
})
export class TicketService {
  constructor(private web3Service: Web3Service) { }

  async getTakenSeats(eventId: number): Promise<number[] | null>
  {
    return await this.web3Service.execute("getTakenSeats", eventId);
  }

  async getTicketById(ticketId: number)
  {
    return await this.web3Service.execute<Ticket>("getTicketById", ticketId);
  }

  async buyTicket(eventId: number, seat: number, price: number): Promise<void>
  {
    const contract = await this.web3Service.createBlockitixEthereumContract();
    // return await this.web3Service.executeWithOptions("buyTicket", {value: `${price}`}, [eventId, seat]);
    await (contract as any).buyTicket(eventId, seat, {value: `${price}`});

    // await (contract as any).widthdraw(eventId);
  }
}
