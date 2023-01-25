import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { getPublicKey } from "nostr-tools";

export interface UserStore {
  key: string | undefined;
  pubkey: string | undefined;
  isLoaded: boolean;

  setKey: (key: string) => void;
  setIsLoaded: (isLoaded: boolean) => void;
}
class userStore implements UserStore {
  key = undefined;
  pubkey = undefined;
  isLoaded = false;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "userStore",
      properties: ["key"],
      storage: AsyncStorage,
    }).then(() => {
      if (!!this.key) this.pubkey = getPublicKey(this.key);
      this.setIsLoaded(true);
    });
  }

  setKey = (key: string) => {
    this.key = key;
    this.pubkey = getPublicKey(key);
  };

  setIsLoaded = (isLoaded: boolean) => {
    this.isLoaded = isLoaded;
  };

  // follow = (follow: { pub: string }) => {
  //   this.contactList.push(follow);
  // };

  // unfollow = (follow: { pub: string }) => {
  //   this.contactList = this.contactList.filter((f) => !(f.pub === follow.pub));
  // };

  // resetContactList = () => {
  //   this.contactList = [];
  // };
}

export default userStore;
