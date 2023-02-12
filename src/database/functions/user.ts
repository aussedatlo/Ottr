import { ResultSet, SQLiteDatabase } from 'react-native-sqlite-storage';
import { User } from '../../types/user';

export const getAllUsers = async (db: SQLiteDatabase): Promise<Array<User>> => {
  console.log('[db] Fetching users from the db...');
  const [results] = await db.executeSql('SELECT * FROM Users;');

  if (!results) return [];

  return results.rows
    .raw()
    .reduce<User[]>((prev: User[], curr: User) => [...prev, curr], []);
};

export const addUser = async (
  db: SQLiteDatabase,
  { pubkey }: User,
): Promise<[ResultSet]> => {
  try {
    const result = await db.executeSql(
      `INSERT OR IGNORE INTO Users (pubkey) VALUES ('${pubkey}');`,
    );

    return result;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const updateUser = async (
  db: SQLiteDatabase,
  { pubkey, name = '', about = '', picture = '', mainRelay = '' }: User,
): Promise<[ResultSet]> => {
  try {
    const result = await db.executeSql(
      `UPDATE Users SET name='${name}', about='${about}', picture='${picture}', mainRelay='${mainRelay}' WHERE pubkey='${pubkey}' AND NOT EXISTS (SELECT * FROM Users WHERE name='${name}' AND about='${about}' AND picture='${picture}' AND mainRelay='${mainRelay}');`,
    );
    return result;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
