import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BackgroundStorageType,
  StorageType,
  UserStorageType,
} from '../types/storage';

export const setLocalStorage = async <T>(key: StorageType, value: T) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
};

export const getLocalStorage = async <T>(
  key: StorageType,
  initialValue: T,
): Promise<T> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : initialValue;
  } catch (e) {
    console.warn(e);
    return initialValue;
  }
};

export const setUserLocalStorage = async (
  userStorage: UserStorageType,
): Promise<void> => {
  await setLocalStorage('user', userStorage);
};

export const getUserLocalStorage = async (
  initialValue?: UserStorageType,
): Promise<UserStorageType> => {
  return await getLocalStorage(
    'user',
    initialValue || {
      theme: undefined,
      profile: undefined,
      relays: undefined,
    },
  );
};

export const setBackgroundLocalStorage = async (
  backgroundStorage: BackgroundStorageType,
): Promise<void> => {
  await setLocalStorage('background', backgroundStorage);
};

export const getBackgroundLocalStorage = async (
  initialValue?: BackgroundStorageType,
): Promise<BackgroundStorageType> => {
  return await getLocalStorage(
    'background',
    initialValue || { lastMessageAt: undefined, connexionId: undefined },
  );
};
