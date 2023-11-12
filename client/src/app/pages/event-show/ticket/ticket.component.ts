import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SeatLayout } from 'src/app/pages/seat-generator/seat-generator.component';
import { Event, SeatType } from 'src/app/shared/models/event';
import { BlockitixContractService } from 'src/app/shared/services/blockitix-contract.service';
import { EventService } from 'src/app/shared/services/event.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { TicketService } from 'src/app/shared/services/ticket.service';
import QRCode from 'qrcode';
import { environment } from 'src/environments/environment';
import { UploadService } from 'src/app/shared/services/upload.service';
import { AlertService } from 'src/app/components/parts/alert/alert.service';

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
  @Input() event?: Event;
  @Input() isCreator?: boolean;
  seatsTaken: {[name: string] : {[row: number]: number[]}} = {};

  layouts: SeatLayout[] = [];
  seatsType: SeatType[] = [];

  selectedTypes: string[] = [];

  constructor(
    // private dialogRef: MatDialogRef<TicketComponent>,
    // @Inject(MAT_DIALOG_DATA) data: Data,
    private ticketService: TicketService,
    private blockitixContractService: BlockitixContractService,
    private loadingService: LoadingService,
    private eventService: EventService,
    private uploadService: UploadService,
    private alertService: AlertService
  ) {
    // this.eventId = data.eventId;
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
    let data = await this.eventService.getSeatLayout(this.event?.id!);
    this.layouts = JSON.parse(data.seatsFormat);
    this.seatsType = data.seatsType;

    let seatsTakenFormats = await this.ticketService.getTakenSeats(this.event?.id!);

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
    return !this.selectedTypes.length || this.selectedTypes.some(type => type === seatType);
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
    this.loadingService.enableLoading();
    let eventDate = new Date(this.event?.datetime!);

    let jsonFile = {
      name: `Ticket ${this.event?.name}`,
      description: `${layout.name}, row: ${row+1}, column: ${column+1}`,
      image: this.event?.coverURL,
      attributes: [
        {
          trait_type: "Seat",
          value: layout.name
        },
        {
          trait_type: "Row",
          value: row + 1
        },
        {
          trait_type: "Column",
          value: column + 1
        }
      ]
    }

    let jsonFileURL = `${environment.ipfsStorageURL}/${await this.uploadService.upload(JSON.stringify(jsonFile))}`;

    this.blockitixContractService.onEvent("BoughtTicket", (ticketId) => {
      this.loadingService.disableLoading();
      this.alertService.alert$.next({type: "success", message: `Successful purchase! You can now import NFT with ticket ID: ${ticketId}`})
    });

    await this.ticketService.buyTicket(this.event?.id!, `${layout.name};${row};${column}`, jsonFileURL, layout.type.price);

    this.addTakenSeat(layout.name, row, column);
  }
}
