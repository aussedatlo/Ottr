import { WebSQLDatabase } from 'expo-sqlite';
import { ExecuteQuery } from './functions/utils';

export const initDatabase = async (db: WebSQLDatabase) => {
  await ExecuteQuery(
    db,
    `
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
`,
  );

  try {
    await ExecuteQuery(
      db,
      `ALTER TABLE Messages
  ADD reaction TEXT`,
    );
    await ExecuteQuery(
      db,
      `ALTER TABLE Messages
  ADD other_reaction TEXT`,
    );
  } catch {}

  await ExecuteQuery(
    db,
    `
CREATE TABLE IF NOT EXISTS Users(
pubkey TEXT PRIMARY KEY NOT NULL,
name TEXT,
about TEXT,
picture TEXT,
mainRelay TEXT,
lastEventAt INT
);
`,
  );

  await ExecuteQuery(
    db,
    `
CREATE TABLE IF NOT EXISTS Version(
  version_id INTEGER PRIMARY KEY NOT NULL,
  version INTEGER
);
`,
  );
};
