import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setLocalStorage(key: string, value: any) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
}

export async function getLocalStorage(key: string, initialValue: any) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : initialValue;
  } catch (e) {
    console.warn(e);
    return initialValue;
  }
}
