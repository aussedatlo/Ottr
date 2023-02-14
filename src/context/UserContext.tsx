import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { getPublicKey } from 'nostr-tools';
import React, { useContext, useEffect, useState } from 'react';
import { DEFAULT_RELAYS_URL } from '../constant/relay';
import { ThemeMode } from '../types/themeMode';
import { User } from '../types/user';
import { getLocalStorage, setLocalStorage } from '../utils/storage';

type UserContextProps = {
  key?: string;
  setKey: (key: string) => void;
  pubkey?: string;
  setPubkey: (pubkey: string) => void;
  user?: User;
  setUser: (user: User) => void;
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  relays?: Array<string>;
  setRelays: (relays: Array<string>) => void;
  isLoaded: boolean;
  logout: () => Promise<void>;
};

const undefinedFunc = () => console.log('not initialized');

export const initialUserContext: UserContextProps = {
  key: undefined,
  setKey: undefinedFunc,
  setPubkey: undefinedFunc,
  setUser: undefinedFunc,
  setThemeMode: undefinedFunc,
  setRelays: undefinedFunc,
  themeMode: 'system',
  relays: [],
  isLoaded: false,
  logout: async () => {
    await new Promise(() => console.log('not initialized'));
  },
};

const UserContext = React.createContext<UserContextProps>(initialUserContext);

type UserContextProviderProps = {
  children: React.ReactElement;
};

const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [key, setKey] = useState<string>();
  const [pubkey, setPubkey] = useState<string>();
  const [user, setUser] = useState<User>();
  const [themeMode, setThemeMode] = useState<ThemeMode>();
  const [relays, setRelays] = useState<Array<string>>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const logout = async () => {
    await SecureStore.deleteItemAsync('key');
    await AsyncStorage.clear();
    setKey(undefined);
    setPubkey(undefined);
    setRelays(DEFAULT_RELAYS_URL);
  };

  useEffect(() => {
    const init = async () => {
      const key = await SecureStore.getItemAsync('key', {});
      if (key && key !== '') {
        setKey(key);
        setPubkey(() => getPublicKey(key));
      }
      const storageData = await getLocalStorage('user', {});
      setThemeMode(() =>
        storageData.theme ? storageData.theme : initialUserContext.themeMode,
      );
      setRelays(() =>
        storageData.relays ? storageData.relays : DEFAULT_RELAYS_URL,
      );
      setUser(() =>
        storageData.user ? storageData.user : initialUserContext.user,
      );
      setIsLoaded(true);
    };

    init();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    setLocalStorage('user', {
      themeMode: themeMode,
      relays: relays,
      user: user,
    });
  }, [themeMode, user, relays, isLoaded]);

  useEffect(() => {
    const createKey = async () => {
      await SecureStore.setItemAsync('key', key, {});
      setPubkey(() => getPublicKey(key));
    };
    if (!key) return;
    createKey();
  }, [key]);

  return (
    <UserContext.Provider
      value={{
        key,
        setKey,
        pubkey,
        setPubkey,
        user,
        setUser,
        themeMode,
        setThemeMode,
        relays,
        setRelays,
        isLoaded,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const user = useContext(UserContext);
  return user;
};

export default UserContextProvider;
