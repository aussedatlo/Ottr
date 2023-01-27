import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { Contact } from "../../types/contact";

export interface ContactStore {
  isLoaded: boolean;
  contactList: Array<Contact>;

  setIsLoaded: (isLoaded: boolean) => void;
  addContact: (contact: Contact) => void;
  reset: () => void;
}
class contactStore implements ContactStore {
  isLoaded = false;
  contactList = [];

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "contactStore",
      properties: [],
      storage: AsyncStorage,
    }).then(() => {
      this.setIsLoaded(true);
    });
  }

  setIsLoaded = (isLoaded: boolean) => {
    this.isLoaded = isLoaded;
  };

  addContact = (contact: Contact) => {
    const contactIndex = this.contactList.findIndex(
      (element) => element.pubkey === contact.pubkey
    );
    if (contactIndex >= 0) {
      console.log(`update contact ${contact.name}`);
      this.contactList[contactIndex] = contact;
    } else {
      console.log(`add contact ${contact.name}`);
      this.contactList.push(contact);
    }
  };

  reset = () => {
    this.contactList = [];
  };
}

export default contactStore;
