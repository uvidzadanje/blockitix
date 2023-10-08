import { Model } from './model';

export interface Ticket extends Model {
  id: number;

  eventId: number;

  redeemed: boolean;

  owner: string;
}
