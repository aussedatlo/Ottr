import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { dateToUnix } from 'nostr-react';
import { Message } from '../../types/message';

interface MessageList {
  [pub: string]: Array<Message>;
}
export interface MessageStore {
  isLoaded: boolean;
  messageList: MessageList;
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
  messageList: MessageList = {};
  lastSend = dateToUnix();
  lastReceive = 0;
  lastSendFromStart = 0;
  lastReceiveFromStart = 0;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'messageStore',
      properties: ['lastSend', 'lastReceive', 'messageList'],
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
    const messageAlreadyExist =
      !!this.messageList[pubkey] &&
      this.messageList[pubkey].filter(
        (value) =>
          value.created_at === message.created_at &&
          value.content === message.content,
      ).length > 0;

    if (messageAlreadyExist) {
      console.warn(`message ${message.id} already exist, skipping`);
      return;
    }

    console.log(`adding message ${JSON.stringify(message)}`);

    if (message.id === undefined)
      // message send by user
      this.lastSend = message.created_at + 1;
    // message receive by user
    else this.lastReceive = message.created_at + 1;

    if (this.messageList[pubkey] === undefined) this.messageList[pubkey] = [];
    this.messageList[pubkey].push(message);
  };

  updateMessage = (pubkey: string, id: string, created_at: number) => {
    this.lastSend = created_at;

    const message = this.messageList[pubkey].filter(
      (item) => item.created_at === created_at,
    )[0];

    if (message.id !== undefined) {
      console.warn(`message already updated: ${message.id}`);
      return;
    }

    console.log(`updating message: ${message.id}`);

    const index = this.messageList[pubkey].indexOf(message);
    this.messageList[pubkey][index].isSend = true;
    this.messageList[pubkey][index].id = id;
  };

  reset = () => {
    this.lastReceive = 0;
    this.lastSend = 0;
    this.messageList = {};
  };
}

export default messageStore;
