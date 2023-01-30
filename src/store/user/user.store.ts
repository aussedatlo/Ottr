import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { getPublicKey } from 'nostr-tools';
import { DEFAULT_RELAYS_URL } from '../../constant/relay';
import { Contact } from '../../types/contact';

export interface UserStore {
  key: string | undefined;
  pubkey: string | undefined;
  isLoaded: boolean;
  profile: Contact | undefined;
  relays: Array<string>;

  setKey: (key: string) => void;
  setIsLoaded: (isLoaded: boolean) => void;
  setProfile: (profile: Contact) => void;
  setRelays: (relays: Array<string>) => void;
}
class userStore implements UserStore {
  key = undefined;
  pubkey = undefined;
  isLoaded = false;
  profile = undefined;
  relays = DEFAULT_RELAYS_URL;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'userStore',
      properties: ['key', 'profile', 'relays'],
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

  setProfile = (profile: Contact) => {
    this.profile = profile;
  };

  setRelays = (relays: Array<string>) => {
    this.relays = relays;
  };
}

export default userStore;
