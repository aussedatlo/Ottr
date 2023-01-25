import { createContext, useContext } from "react";
import contactStore, { ContactStore } from "./contact/contact.store";
import messageStore, { MessageStore } from "./message/message.store";
import userStore, { UserStore } from "./user/user.store";

export default class RootStore {
  contactStore: ContactStore;
  messageStore: MessageStore;
  userStore: UserStore;

  constructor() {
    this.contactStore = new contactStore();
    this.messageStore = new messageStore();
    this.userStore = new userStore();
  }
}

const StoresContext = createContext(new RootStore());

// this will be the function available for the app to connect to the stores
export const useStores = () => useContext(StoresContext);
