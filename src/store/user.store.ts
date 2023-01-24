import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { dateToUnix } from "nostr-react";

type Message = {
  id: string;
  content: string;
  created_at: number;
  pubkey: string;
  isSend: boolean;
};

class userStore {
  key: string | undefined = undefined;
  isLoaded: boolean = false;
  contactList: Array<{ pub: string }> = [];
  messageList: {
    [pub: string]: Array<Message>;
  } = {};
  lastSend: number = dateToUnix();
  lastReceive: number = 0;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "userStore",
      properties: ["key", "contactList"],
      storage: AsyncStorage,
    }).then(() => this.setIsLoaded(true));
    // }).then(() => this.resetContactList());
  }

  setKey = (key: string) => {
    this.key = key;
  };

  setIsLoaded = (isLoaded: boolean) => {
    this.isLoaded = isLoaded;
  };

  follow = (follow: { pub: string }) => {
    this.contactList.push(follow);
  };

  unfollow = (follow: { pub: string }) => {
    this.contactList = this.contactList.filter((f) => !(f.pub === follow.pub));
  };

  resetContactList = () => {
    this.contactList = [];
  };

  addMessage = (pubkey: string, message: Message) => {
    // TODO: errors ?
    if (this.messageList[pubkey] === undefined) this.messageList[pubkey] = [];
    this.messageList[pubkey].push(message);
  };

  updateMessage = (pubkey: string, id: string, created_at: number) => {
    this.lastSend = created_at;
    // TODO: errors ?
    const message = this.messageList[pubkey].filter(
      (item) => item.created_at === created_at
    )[0];
    const index = this.messageList[pubkey].indexOf(message);
    this.messageList[pubkey][index].isSend = true;
    this.messageList[pubkey][index].id = id;
  };
}

export default userStore;
