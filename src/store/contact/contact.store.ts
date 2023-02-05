import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable, observable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { Contact } from '../../types/contact';

export interface ContactStore {
  isLoaded: boolean;
  contactList: Array<Contact>;

  setIsLoaded: (isLoaded: boolean) => void;
  addContact: (contact: Contact) => void;
  reset: () => void;
}
class contactStore implements ContactStore {
  isLoaded = false;
  contactList = observable.array([]);

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'contactStore',
      properties: ['contactList'],
      storage: AsyncStorage,
    })
      .then(() => {
        this.setIsLoaded(true);
      })
      .catch((e) => console.error(e));
  }

  setIsLoaded = (isLoaded: boolean) => {
    this.isLoaded = isLoaded;
  };

  addContact = (contact: Contact) => {
    const contactIndex = this.contactList.findIndex(
      (element: Contact) => element.pubkey === contact.pubkey,
    );
    if (contactIndex >= 0) {
      console.log(`update contact ${contact.pubkey}`);
      this.contactList[contactIndex] = contact;
    } else {
      console.log(`add contact ${contact.name}`);
      this.contactList.push(contact);
    }
  };

  reset = () => {
    this.contactList = observable.array([]);
  };
}

export default contactStore;
