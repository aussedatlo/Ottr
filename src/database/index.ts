import { Event } from 'nostr-tools';
import {
  open,
  QuickSQLiteConnection,
  BatchQueryResult,
  QueryResult,
} from 'react-native-quick-sqlite';

export interface DirectMessage extends Event {
  conversation_id: string;
  read: boolean;
  pending: boolean;
}

export const initDatabase: () => QuickSQLiteConnection = () => {
  return open({ name: 'ottr.sqlite' });
};

export const getItems: (resultSet: QueryResult) => object[] = (resultSet) => {
  const result: object[] = [];

  if (resultSet.rows) {
    for (let i = 0; i < resultSet.rows.length; i++) {
      result.push(resultSet.rows.item(i));
    }
  }

  return result;
};

export const simpleExecute: (
  query: string,
  db: QuickSQLiteConnection,
) => Promise<QueryResult> = async (query, db) => {
  return db.execute(query);
};

export const dropTables: (
  db: QuickSQLiteConnection,
) => Promise<BatchQueryResult> = async (db) => {
  const dropQueries: Array<[string, [any[] | any[][]]]> = [
    ['DELETE FROM nostros_users;', [[]]],
    ['DELETE FROM nostros_notes;', [[]]],
    ['DELETE FROM nostros_direct_messages;', [[]]],
  ];
  return db.executeBatch(dropQueries);
};
