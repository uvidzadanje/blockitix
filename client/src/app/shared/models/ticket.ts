import { Model } from './model';

export interface Ticket extends Model {
  id: number;

  eventId: number;

  owner: string;

  seatFormat: string;
}
