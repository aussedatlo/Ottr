export type Message = {
  id: string;
  content: string;
  created_at: number;
  pubkey: string;
  isSend: boolean;
  isSender: boolean;
};
