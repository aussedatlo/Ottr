import { SQLResultSet, WebSQLDatabase } from 'expo-sqlite';
import { Message } from '../../types/message';
import { Reaction } from '../../types/reaction';
import { ExecuteQuery } from './utils';

export const getAllMessages = async (
  db: WebSQLDatabase,
): Promise<Array<Message>> => {
  console.log('[db] Fetching messages from the db...');

  const results = await ExecuteQuery(
    db,
    'SELECT * FROM Messages ORDER BY created_at DESC;',
  );

  return results.rows._array.reduce(
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
  db: WebSQLDatabase,
  { id, content, created_at, kind, pubkey, sig, tags, pending, seen }: Message,
): Promise<SQLResultSet> => {
  try {
    const results = await ExecuteQuery(
      db,
      `INSERT OR IGNORE INTO Messages (id, content, created_at, kind, pubkey, sig, tags, pending, seen) VALUES (?,?,?,?,?,?,?,?,?);`,
      [
        id,
        content,
        created_at,
        kind,
        pubkey,
        sig,
        JSON.stringify(tags),
        pending.toString(),
        seen.toString(),
      ],
    );
    return results;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const addReaction = async (
  db: WebSQLDatabase,
  messageId: string,
  reaction: Reaction,
): Promise<SQLResultSet> => {
  try {
    const results = await ExecuteQuery(
      db,
      `UPDATE Messages SET reaction='${reaction}' WHERE id='${messageId}' AND NOT EXISTS (SELECT * FROM Messages WHERE id='${messageId}' AND reaction='${reaction}');`,
    );
    console.log(results);
    return results;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const addOtherReaction = async (
  db: WebSQLDatabase,
  messageId: string,
  reaction: Reaction,
): Promise<SQLResultSet> => {
  try {
    const results = await ExecuteQuery(
      db,
      `UPDATE Messages SET other_reaction='${reaction}' WHERE id='${messageId}' AND NOT EXISTS (SELECT * FROM Messages WHERE id='${messageId}' AND other_reaction='${reaction}');`,
    );
    console.log(results);
    return results;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

// set pending to a message
export const updateMessage = async (
  db: WebSQLDatabase,
  { id, pending, seen }: Message,
): Promise<SQLResultSet> => {
  try {
    const results = await ExecuteQuery(
      db,
      `UPDATE Messages SET pending='${pending}' WHERE id='${id}' AND NOT EXISTS (SELECT * FROM Messages WHERE id='${id}' AND pending='${pending}' AND seen='${seen}');`,
    );
    return results;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
