import { Event } from 'nostr-tools';

export type Message = Event & {
  pending: boolean;
  seen: boolean;
};
