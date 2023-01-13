import { createContext, useContext } from "react";
import UserStore from "./user.store";

class RootStore {
  userStore: any;

  constructor() {
    this.userStore = new UserStore();
  }
}

const StoresContext = createContext(new RootStore());

// this will be the function available for the app to connect to the stores
export const useStores = () => useContext(StoresContext);
