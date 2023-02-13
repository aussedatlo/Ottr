import { AppState, AppStateStatus } from 'react-native';
import { openDatabase, SQLResultSet, WebSQLDatabase } from 'expo-sqlite';
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
  addMessage(message: Message): Promise<SQLResultSet>;
  addUser(user: User): Promise<SQLResultSet>;
  // Read
  getAllMessages(): Promise<Array<Message>>;
  getAllUsers(): Promise<Array<User>>;
  // update
  updateMessage(message: Message): Promise<SQLResultSet>;
  updateUser(user: User): Promise<SQLResultSet>;
  // delete
  reset(): Promise<void>;
}

let databaseInstance: WebSQLDatabase | undefined;
let appState = 'active';

const handleAppStateChange = async (nextAppState: AppStateStatus) => {
  if (appState === 'active' && nextAppState.match(/inactive|background/)) {
    await close();
  }
  appState = nextAppState;
};
AppState.addEventListener('change', handleAppStateChange);

export const getDatabase = (): WebSQLDatabase => {
  if (databaseInstance !== undefined) {
    return databaseInstance;
  }

  try {
    const db = openDatabase('ottr.sql');
    db.transaction(initDatabase);
    databaseInstance = db;
    return db;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const reset = async (): Promise<void> => {
  const db = getDatabase();
  db.transaction(deleteDatabase);
  databaseInstance = undefined;
};

const close = async (): Promise<void> => {
  if (databaseInstance === undefined) {
    return;
  }
  databaseInstance.closeAsync();
  console.log('[db] Database closed.');
  databaseInstance = undefined;
};

export const sqliteDatabase: Database = {
  addMessage: async (message: Message) => addMessage(getDatabase(), message),
  addUser: async (user: User) => addUser(getDatabase(), user),
  getAllMessages: async () => getAllMessages(getDatabase()),
  getAllUsers: async () => getAllUsers(getDatabase()),
  updateMessage: async (message) => updateMessage(getDatabase(), message),
  updateUser: async (user: User) => updateUser(getDatabase(), user),
  reset,
};
