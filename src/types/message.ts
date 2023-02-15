import { Event } from 'nostr-tools';
import { Reaction } from './reaction';

export type Message = Event & {
  pending: boolean;
  seen: boolean;
  reaction: Reaction;
  other_reaction: Reaction;
};
