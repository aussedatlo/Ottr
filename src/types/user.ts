export type User = {
  pubkey: string;
  name?: string;
  about?: string;
  picture?: string;
  mainRelay?: string;
  lastEventAt?: number;
};
