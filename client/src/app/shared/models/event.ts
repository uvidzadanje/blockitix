import { Model } from "./model";

export interface SeatType {
  price: number;
  name: string;
  colorMark: string;
}

export interface Event extends Model {
  name: string;

  totalTickets: number;

  remainingTickets: number;

  owner: string;

  date: string;

  time: string;

  location: string;

  seatFormat: string;

  isCanceled: boolean;

  seatTypes: SeatType[];
}
