import { ExecuteQuery } from './utils';
import { User } from '../../types/user';
import { SQLResultSet, WebSQLDatabase } from 'expo-sqlite';

export const getAllUsers = async (db: WebSQLDatabase): Promise<Array<User>> => {
  console.log('[db] Fetching users from the db...');

  const results = await ExecuteQuery(db, 'SELECT * FROM Users ORDER BY lastEventAt DESC;');

  if (!results) return [];

  return results.rows._array.reduce<User[]>(
    (prev: User[], curr: User) => [...prev, curr],
    [],
  );
};

export const addUser = async (
  db: WebSQLDatabase,
  { pubkey }: User,
): Promise<SQLResultSet> => {
  try {
    const results = await ExecuteQuery(
      db,
      `INSERT OR IGNORE INTO Users (pubkey) VALUES ('${pubkey}');`,
    );

    return results;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const updateUser = async (
  db: WebSQLDatabase,
  {
    pubkey,
    name = '',
    about = '',
    picture = '',
    mainRelay = '',
    lastEventAt = 0,
  }: User,
): Promise<SQLResultSet> => {
  try {
    const results = await ExecuteQuery(
      db,
      `UPDATE Users SET name='${name}', about='${about}', picture='${picture}', mainRelay='${mainRelay}', lastEventAt='${lastEventAt}' WHERE pubkey='${pubkey}' AND NOT EXISTS (SELECT * FROM Users WHERE name='${name}' AND about='${about}' AND picture='${picture}' AND mainRelay='${mainRelay}' AND lastEventAt='${lastEventAt}');`,
    );
    return results;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const updateUserLastEventAt = async (
  db: WebSQLDatabase,
  { pubkey, lastEventAt = 0 }: User,
): Promise<SQLResultSet> => {
  try {
    const results = await ExecuteQuery(
      db,
      `UPDATE Users SET lastEventAt='${lastEventAt}' WHERE pubkey='${pubkey}' AND NOT EXISTS (SELECT * FROM Users WHERE lastEventAt>${lastEventAt});`,
    );
    return results;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
