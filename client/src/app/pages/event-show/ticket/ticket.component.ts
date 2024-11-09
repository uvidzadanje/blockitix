import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SeatLayout } from 'src/app/pages/seat-generator/seat-generator.component';
import { Event, SeatType } from 'src/app/shared/models/event';
import { BlockitixContractService } from 'src/app/shared/services/blockitix-contract.service';
import { EventService } from 'src/app/shared/services/event.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { TicketService } from 'src/app/shared/services/ticket.service';
import { environment } from 'src/environments/environment';
import { IPFSService } from 'src/app/shared/services/ipfs.service';
import { AlertService } from 'src/app/components/parts/alert/alert.service';
import { PanZoomAPI, PanZoomConfig } from 'ngx-panzoom';
import { Subscription } from 'rxjs';

interface Seat {
  layout: SeatLayout;
  row: number;
  column: number;
};

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css'],
})
export class TicketComponent implements OnInit, OnDestroy {
  @Input() event?: Event;
  @Input() isCreator?: boolean;
  seatsTaken: {[name: string] : {[row: number]: number[]}} = {};

  layouts: SeatLayout[] = [];
  seatsType: SeatType[] = [];

  selectedTypes: string[] = [];
  selectedSeats: Seat[] = [];

  panZoomConfig: PanZoomConfig = new PanZoomConfig({
    initialZoomLevel: 1,
    freeMouseWheel: false,
    zoomStepDuration: 0.1,
    zoomOnDoubleClick: false,
    friction: 10,
    zoomOnMouseWheel: false
  });

  panZoomApiSubscription?: Subscription;
  panZoomApi?: PanZoomAPI;

  constructor(
    private ticketService: TicketService,
    private blockitixContractService: BlockitixContractService,
    private loadingService: LoadingService,
    private eventService: EventService,
    private uploadService: IPFSService,
    private alertService: AlertService
  ) { }

  async ngOnInit(): Promise<void> {
    this.panZoomApiSubscription = this.panZoomConfig.api.subscribe((api: PanZoomAPI) => this.panZoomApi = api);

    let data = await this.eventService.getSeatLayout(this.event?.id!);
    this.layouts = JSON.parse(await (await fetch(`${environment.ipfsStorageURL}/${data.seatsFormatURL}`)).text());
    this.seatsType = data.seatsType;

    let seatsTakenFormats = await this.ticketService.getTakenSeats(this.event?.id!);

    seatsTakenFormats?.forEach(takenSeat => {
      let [name, row, column] = takenSeat.split(";");

      this.addTakenSeat(name, +row, +column);
    });
  }

  ngOnDestroy(): void {
    this.panZoomApiSubscription?.unsubscribe();
  }

  zoomIn() {
		this.panZoomApi?.zoomIn();
	}

	zoomOut() {
		this.panZoomApi?.zoomOut();
	}

	reset() {
		this.panZoomApi?.resetView();
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

  isSelectedType(seatType: string)
  {
    return !this.selectedTypes.length || this.selectedTypes.some(type => type === seatType);
  }

  isSelected(layoutName: string, row: number, column: number)
  {
    return this.selectedSeats.some(selectedSeat => selectedSeat.layout.name === layoutName && selectedSeat.row === row && selectedSeat.column === column);
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

    let jsonFile = {
      name: `Ticket ${this.event?.name}`,
      description: `${layout.name}, row: ${row+1}, column: ${column+1}`,
      image: this.event?.coverURL
    }

    let jsonFileURL = `${environment.ipfsStorageURL}/${await this.uploadService.upload(JSON.stringify(jsonFile))}`;

    this.blockitixContractService.onEvent("BoughtTicket", async (ticketId) => {
      this.loadingService.disableLoading();
      this.alertService.alert$.next({type: "success", message: `Successful purchase! You can now import NFT with ticket ID: ${ticketId}`});
      await (window as any).ethereum.request({
        "method": "wallet_watchAsset",
        "params": {
          "type": "ERC721",
          "options": {
            "address": `${environment.blockitixContractAddress}`,
            "tokenId": `${ticketId}`
          }
        }
      });
    });

    await this.ticketService.buyTicket(this.event?.id!, `${layout.name};${row};${column}`, jsonFileURL, layout.type.price);

    this.addTakenSeat(layout.name, row, column);
  }

  toggleSelectSeat(layout: SeatLayout, row: number, column: number)
  {
    if(this.isSelected(layout.name, row, column))
    {
      this.selectedSeats = this.selectedSeats.filter(selectedSeat => !(selectedSeat.layout.name === layout.name && selectedSeat.row === row && selectedSeat.column === column));
      return;
    }
    this.selectedSeats.push({layout, row, column});
  }

  async buyTickets()
  {
    this.loadingService.enableLoading();

    let tokens: {seatId: string, tokenURI: string}[] = await Promise.all(this.selectedSeats.map(async (selectedSeat) => {
      let jsonFile = {
        name: `Ticket ${this.event?.name}`,
        description: `${selectedSeat.layout.name}, row: ${selectedSeat.row+1}, column: ${selectedSeat.column+1}`,
        image: this.event?.coverURL
      }

      let jsonFileURL = `${environment.ipfsStorageURL}/${await this.uploadService.upload(JSON.stringify(jsonFile))}`;

      return {
        seatId: `${selectedSeat.layout.name};${selectedSeat.row};${selectedSeat.column}`,
        tokenURI: jsonFileURL
      }
    }))

    this.blockitixContractService.onEvent("BoughtTickets", async (ticketIds: number[]) => {
      this.loadingService.disableLoading();
      await (window as any).ethereum.sendAsync(ticketIds.map(ticketId => ({
        "method": "wallet_watchAsset",
        "params": {
          "type": "ERC721",
          "options": {
            "address": `${environment.blockitixContractAddress}`,
            "tokenId": `${ticketId}`
          }
        }
      })));
    });

    this.ticketService.buyTickets(this.event?.id!, tokens, this.selectedSeats.reduce((acc, curr) => acc + curr.layout.type.price, 0));

    this.selectedSeats.forEach(selectedSeat => {
      this.addTakenSeat(selectedSeat.layout.name, selectedSeat.row, selectedSeat.column);
    })

    this.selectedSeats = [];
  }
}
