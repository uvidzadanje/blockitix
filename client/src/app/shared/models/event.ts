import { Model } from "./model";

export interface Event extends Model {
  name: string;

  price: number;

  totalTickets: number;

  remainingTickets: number;

  owner: string;

  date: string;

  time: string;

  location: string;
}
