import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { TicketService } from 'src/app/shared/services/ticket.service';
import { Web3Service } from 'src/app/shared/services/web3.service';

interface Data {
  eventId: number;
  totalTickets: number;
  price: number;
}

interface Seat {
  seat: number;
  isTaken: boolean;
}

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
})
export class TicketComponent implements OnInit {
  eventId: number;
  price: number;
  totalTickets: number;
  allSeats: Seat[] = [];
  seatsTaken: number[] = [];

  constructor(
    private dialogRef: MatDialogRef<TicketComponent>,
    @Inject(MAT_DIALOG_DATA) data: Data,
    private ticketService: TicketService,
    private web3Service: Web3Service,
    private loadingService: LoadingService
  ) {
    this.eventId = data.eventId;
    this.price = data.price;
    this.totalTickets = data.totalTickets;
  }

  async ngOnInit(): Promise<void> {
    await this.web3Service.onEvent('BoughtTicket', async (ticketId, seat) => {
      console.log('ticketId', ticketId);
      console.log('seat', seat);
      this.seatsTaken = [...this.seatsTaken, Number(seat)];
      this.allSeats = Array(Number(this.totalTickets))
        .fill(0)
        .map((x, i) => ({
          seat: i + 1,
          isTaken: this.seatsTaken.some(
            (seatTaken) => Number(seatTaken) === i + 1
          ),
        }));
      this.loadingService.disableLoading();
    });
    this.seatsTaken =
      (await this.ticketService.getTakenSeats(this.eventId)) ?? [];
    this.allSeats = Array(Number(this.totalTickets))
      .fill(0)
      .map((x, i) => ({
        seat: i + 1,
        isTaken: this.seatsTaken.some(
          (seatTaken) => Number(seatTaken) === i + 1
        ),
      }));
  }

  async buyTicket(seat: number) {
    this.loadingService.enableLoading();
    await this.ticketService.buyTicket(this.eventId, seat, this.price);
  }
}
