import { WebSQLDatabase } from 'expo-sqlite';
import { ExecuteQuery } from './functions/utils';

export const deleteDatabase = async (db: WebSQLDatabase) => {
  await ExecuteQuery(db, 'DROP TABLE IF EXISTS Messages;');
  await ExecuteQuery(db, 'DROP TABLE IF EXISTS Users;');
  await ExecuteQuery(db, 'DROP TABLE IF EXISTS Version;');
};
