import { Transaction } from 'react-native-sqlite-storage';

export const initDatabase = (transaction: Transaction) => {
  // Messages table
  transaction.executeSql(`
      CREATE TABLE IF NOT EXISTS Messages(
      id TEXT PRIMARY KEY NOT NULL,
      content TEXT NOT NULL,
      created_at INT NOT NULL,
      kind INT NOT NULL,
      pubkey TEXT NOT NULL,
      sig TEXT NOT NULL,
      tags TEXT NOT NULL,
      pending BOOLEAN DEFAULT FALSE,
      seen BOOLEAN DEFAULT FALSE
      );
    `);

  // Users table
  transaction.executeSql(`
      CREATE TABLE IF NOT EXISTS Users(
      pubkey TEXT PRIMARY KEY NOT NULL,
      name TEXT,
      about TEXT,
      picture TEXT,
      mainRelay TEXT
      );
    `);

  // Version table
  transaction.executeSql(`
      CREATE TABLE IF NOT EXISTS Version(
        version_id INTEGER PRIMARY KEY NOT NULL,
        version INTEGER
      );
    `);
};
