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

  datetime: string;

  city: string;

  location: string;

  seatsFormatURL: string;

  isCanceled: boolean;

  coverURL: string;

  descriptionURL: string;

  category: string;

  seatTypes: SeatType[];
}

type EditEventFields = "id" | "name" | "datetime" | "location" | "coverURL" | "descriptionURL"| "city" | "category"

export interface EditEvent extends Pick<Event, EditEventFields> { }
