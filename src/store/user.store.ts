import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

class userStore {
  key: string | undefined = undefined;
  isLoaded: boolean = false;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "userStore",
      properties: ["key"],
      storage: AsyncStorage,
    }).then(() => this.setIsLoaded(true));
  }

  setKey = (key: string) => {
    this.key = key;
  };

  setIsLoaded = (isLoaded: boolean) => {
    this.isLoaded = isLoaded;
  };
}

export default userStore;
