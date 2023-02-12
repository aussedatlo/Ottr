import { ResultSet, SQLiteDatabase } from 'react-native-sqlite-storage';
import { Message } from '../../types/message';

export const getAllMessages = async (
  db: SQLiteDatabase,
): Promise<Array<Message>> => {
  console.log('[db] Fetching messages from the db...');

  const [results] = await db.executeSql(
    'SELECT * FROM Messages ORDER BY created_at DESC;',
  );

  return results.rows.raw().reduce(
    (prev: Message[], curr: Message) => [
      ...prev,
      {
        ...curr,
        tags: JSON.parse(curr.tags as unknown as string),
        pending: JSON.parse(curr.pending as unknown as string),
        seen: JSON.parse(curr.seen as unknown as string),
      },
    ],
    [],
  );
};

// Insert a new list into the database
export const addMessage = async (
  db: SQLiteDatabase,
  { id, content, created_at, kind, pubkey, sig, tags, pending, seen }: Message,
): Promise<[ResultSet]> => {
  try {
    const results = await db.executeSql(
      `INSERT OR IGNORE INTO Messages (id, content, created_at, kind, pubkey, sig, tags, pending, seen) VALUES ('${id}','${content}','${created_at}','${kind}','${pubkey}','${sig}','${JSON.stringify(
        tags,
      )}','${pending}','${seen}');`,
    );
    return results;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

// set pending to a message
export const updateMessage = async (
  db: SQLiteDatabase,
  { id, pending, seen }: Message,
): Promise<[ResultSet]> => {
  try {
    const results = await db.executeSql(
      `UPDATE Messages SET pending='${pending}' WHERE id='${id}' AND NOT EXISTS (SELECT * FROM Messages WHERE id='${id}' AND pending='${pending}' AND seen='${seen}');`,
    );
    return results;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
