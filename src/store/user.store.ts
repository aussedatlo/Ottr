import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";

class userStore {
  key: string = "";

  constructor() {
    makeAutoObservable(this);
    console.log("constructor");
    makePersistable(this, {
      name: "userStore",
      properties: ["key"],
      storage: AsyncStorage,
    });
  }

  setKey = (key: string) => {
    this.key = key;
  };
}

export default userStore;
