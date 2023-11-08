import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SeatLayout } from 'src/app/pages/seat-generator/seat-generator.component';
import { SeatType } from 'src/app/shared/models/event';
import { BlockitixContractService } from 'src/app/shared/services/blockitix-contract.service';
import { EventService } from 'src/app/shared/services/event.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { TicketService } from 'src/app/shared/services/ticket.service';

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
  // price: number;
  // totalTickets: number;
  // allSeats: Seat[] = [];
  seatsTaken: {[name: string] : {[row: number]: number[]}} = {};

  layouts: SeatLayout[] = [];
  seatsType: SeatType[] = [];

  selectedType: string = "";

  constructor(
    private dialogRef: MatDialogRef<TicketComponent>,
    @Inject(MAT_DIALOG_DATA) data: Data,
    private ticketService: TicketService,
    private blockitixContractService: BlockitixContractService,
    private loadingService: LoadingService,
    private eventService: EventService
  ) {
    this.eventId = data.eventId;
  }

  async ngOnInit(): Promise<void> {
    // await this.blockitixContractService.onEvent('BoughtTicket', async (ticketId, seat) => {
    //   this.seatsTaken = [...this.seatsTaken, Number(seat)];
    //   this.allSeats = Array(Number(this.totalTickets))
    //     .fill(0)
    //     .map((x, i) => ({
    //       seat: i + 1,
    //       isTaken: this.seatsTaken.some(
    //         (seatTaken) => Number(seatTaken) === i + 1
    //       ),
    //     }));
    //   this.loadingService.disableLoading();
    // });
    // this.seatsTaken =
    //   (await this.ticketService.getTakenSeats(this.eventId)) ?? [];
    // this.allSeats = Array(Number(this.totalTickets))
    //   .fill(0)
    //   .map((x, i) => ({
    //     seat: i + 1,
    //     isTaken: this.seatsTaken.some(
    //       (seatTaken) => Number(seatTaken) === i + 1
    //     ),
    //   }));
    let data = await this.eventService.getSeatLayout(this.eventId);
    this.layouts = JSON.parse(data.seatsFormat);
    this.seatsType = data.seatsType;

    let seatsTakenFormats = await this.ticketService.getTakenSeats(this.eventId);

    seatsTakenFormats?.forEach(takenSeat => {
      let [name, row, column] = takenSeat.split(";");

      this.addTakenSeat(name, +row, +column);
    });
  }

  isTaken(layoutName: string, row: number, column: number)
  {
    if(!this.seatsTaken[layoutName])
    {
      return false;
    }

    if(!this.seatsTaken[layoutName][row])
    {
      return false;
    }

    return this.seatsTaken[layoutName][row].some(c => c === column);
  }

  isSelected(seatType: string)
  {
    return !this.selectedType || this.selectedType === seatType;
  }

  addTakenSeat(layoutName: string, row: number, column: number)
  {
    if(!this.seatsTaken[layoutName])
      {
        this.seatsTaken[layoutName] = {[+row]: [+column]};
        return;
      }

      if(!this.seatsTaken[layoutName][+row])
      {
        this.seatsTaken[layoutName][+row] = [+column];
        return;
      }

      this.seatsTaken[layoutName][+row] = [...this.seatsTaken[layoutName][+row], +column];
  }

  async buyTicket(layout: SeatLayout, row: number, column: number) {
    // this.loadingService.enableLoading();
    await this.ticketService.buyTicket(this.eventId, `${layout.name};${row};${column}`, layout.type.price);
    this.addTakenSeat(layout.name, row, column);
  }
}
