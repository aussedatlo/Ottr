import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeAutoObservable } from 'mobx';
import { makePersistable } from 'mobx-persist-store';
import { getPublicKey } from 'nostr-tools';
import { Contact } from '../../types/contact';

export type ThemeMode = 'system' | 'light' | 'dark';

export interface UserStore {
  key: string | undefined;
  pubkey: string;
  isLoaded: boolean;
  profile: Contact | undefined;
  relays: Array<string>;
  themeMode: ThemeMode;

  setKey: (key: string) => void;
  setIsLoaded: (isLoaded: boolean) => void;
  setProfile: (profile: Contact) => void;
  setRelays: (relays: Array<string>) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

class userStore implements UserStore {
  key = '';
  pubkey = '';
  isLoaded = false;
  profile = undefined;
  relays = [];
  themeMode: ThemeMode = 'system';

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'userStore',
      properties: ['key', 'profile', 'relays', 'themeMode'],
      storage: AsyncStorage,
    })
      .then(() => {
        if (this.key) this.pubkey = getPublicKey(this.key);
        this.setIsLoaded(true);
      })
      .catch((e) => console.error(e));
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

  setThemeMode = (mode: ThemeMode) => {
    this.themeMode = mode;
  };
}

export default userStore;
