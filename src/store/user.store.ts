import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

class userStore {
  key: string | undefined = undefined;
  isLoaded: boolean = false;
  contactList: Array<{ pub: string; relay: string }> = [];

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "userStore",
      properties: ["key", "contactList"],
      storage: AsyncStorage,
    }).then(() => this.setIsLoaded(true));
  }

  setKey = (key: string) => {
    this.key = key;
  };

  setIsLoaded = (isLoaded: boolean) => {
    this.isLoaded = isLoaded;
  };

  follow = (follow: { pub: string; relay: string }) => {
    this.contactList.push(follow);
  };

  unfollow = (follow: { pub: string; relay: string }) => {
    this.contactList = this.contactList.filter(
      (f) => !(f.pub === follow.pub && f.relay === follow.relay)
    );
  };
}

export default userStore;
