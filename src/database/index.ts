import { AppState, AppStateStatus } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { Message } from '../types/message';
import { User } from '../types/user';
import { deleteDatabase } from './delete';
import {
  addMessage,
  getAllMessages,
  updateMessage,
} from './functions/messages';
import { addUser, getAllUsers, updateUser } from './functions/user';
import { initDatabase } from './init';

export interface Database {
  // Create
  addMessage(message: Message): Promise<[SQLite.ResultSet]>;
  addUser(user: User): Promise<[SQLite.ResultSet]>;
  // Read
  getAllMessages(): Promise<Array<Message>>;
  getAllUsers(): Promise<Array<User>>;
  // update
  updateMessage(message: Message): Promise<[SQLite.ResultSet]>;
  updateUser(user: User): Promise<[SQLite.ResultSet]>;
  // delete
  reset(): Promise<void>;
}

let databaseInstance: SQLite.SQLiteDatabase | undefined;
let appState = 'active';

const handleAppStateChange = async (nextAppState: AppStateStatus) => {
  if (appState === 'active' && nextAppState.match(/inactive|background/)) {
    await close();
  }
  appState = nextAppState;
};
AppState.addEventListener('change', handleAppStateChange);

export const getDatabase = (): Promise<SQLite.SQLiteDatabase> => {
  if (databaseInstance !== undefined) {
    return Promise.resolve(databaseInstance);
  }
  return open();
};

export const reset = async (): Promise<void> => {
  const db = await getDatabase();
  await db.transaction(deleteDatabase);
  databaseInstance = undefined;
};

const open = async (): Promise<SQLite.SQLiteDatabase> => {
  SQLite.DEBUG(false);
  SQLite.enablePromise(true);

  if (databaseInstance) {
    return databaseInstance;
  }

  const db = await SQLite.openDatabase({
    name: 'ottr.sql',
    location: 'Documents',
  });

  await db.transaction(initDatabase);
  databaseInstance = db;
  return db;
};

const close = async (): Promise<void> => {
  if (databaseInstance === undefined) {
    return;
  }
  await databaseInstance.close();
  console.log('[db] Database closed.');
  databaseInstance = undefined;
};

export const sqliteDatabase: Database = {
  addMessage: async (message: Message) =>
    addMessage(await getDatabase(), message),
  addUser: async (user: User) => addUser(await getDatabase(), user),
  getAllMessages: async () => getAllMessages(await getDatabase()),
  getAllUsers: async () => getAllUsers(await getDatabase()),
  updateMessage: async (message) => updateMessage(await getDatabase(), message),
  updateUser: async (user: User) => updateUser(await getDatabase(), user),
  reset,
};
