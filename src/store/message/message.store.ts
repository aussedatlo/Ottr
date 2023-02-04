import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable, observable, ObservableMap } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { dateToUnix } from 'nostr-react';
import { Message } from '../../types/message';

export type MessageList = ObservableMap<string, Array<Message>>;
export interface MessageStore {
  isLoaded: boolean;
  messageList: MessageList;
  messagePubkeyOrder: Array<string>;
  lastSend: number;
  lastReceive: number;
  lastSendFromStart: number;
  lastReceiveFromStart: number;

  setIsLoaded: (isLoaded: boolean) => void;
  addMessage: (pubkey: string, message: Message) => void;
  updateMessage: (pubkey: string, id: string, created_at: number) => void;
  reset: () => void;
}

class messageStore implements MessageStore {
  isLoaded = false;
  messageList: MessageList = observable.map();
  messagePubkeyOrder = observable.array([]);
  lastSend = dateToUnix();
  lastReceive = 0;
  lastSendFromStart = 0;
  lastReceiveFromStart = 0;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'messageStore',
      properties: [
        'lastSend',
        'lastReceive',
        'messageList',
        'messagePubkeyOrder',
      ],
      storage: AsyncStorage,
    })
      .then(() => {
        this.lastSendFromStart = this.lastSend;
        this.lastReceiveFromStart = this.lastReceive;
        this.setIsLoaded(true);
      })
      .catch((e) => console.error(e));
  }

  setIsLoaded = (isLoaded: boolean) => {
    this.isLoaded = isLoaded;
  };

  addMessage = (pubkey: string, message: Message) => {
    if (this.messageList.get(pubkey) === undefined)
      this.messageList.set(pubkey, []);

    const index = this.messageList
      .get(pubkey)
      .findIndex(
        (value) =>
          value.created_at === message.created_at &&
          value.content === message.content,
      );

    if (index >= 0) {
      console.warn(`message ${message.id} already exist, skipping`);
      return;
    }

    // update message pubkey order
    this.messagePubkeyOrder = observable.array([
      pubkey,
      ...this.messagePubkeyOrder.filter((pk) => pk !== pubkey),
    ]);

    console.log(`adding message ${JSON.stringify(message)}`);
    this.messageList.set(pubkey, [...this.messageList.get(pubkey), message]);

    // message send by user
    if (message.id === undefined) return;
    else this.lastReceive = message.created_at + 1;
  };

  updateMessage = (pubkey: string, id: string, created_at: number) => {
    this.lastSend = created_at;

    const message = this.messageList
      .get(pubkey)
      .filter((item) => item.created_at === created_at)[0];

    if (message.id !== undefined) {
      console.warn(`message already updated: ${message.id}`);
      return;
    }

    console.log(`updating message: ${id}`);

    const index = this.messageList.get(pubkey).indexOf(message);
    this.messageList.get(pubkey)[index].isSend = true;
    this.messageList.get(pubkey)[index].id = id;
  };

  reset = () => {
    this.lastReceive = 0;
    this.lastSend = 0;
    this.messageList = observable.map();
  };
}

export default messageStore;
