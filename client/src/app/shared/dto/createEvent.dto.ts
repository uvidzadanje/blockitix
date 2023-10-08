import { Event } from "../models/event";

type PropsToOmit = 'id' | 'remainingTickets' | 'owner';

export interface CreateEvent extends Omit<Event, PropsToOmit> { }
