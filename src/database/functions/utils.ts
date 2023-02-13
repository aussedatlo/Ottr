import { SQLResultSet, WebSQLDatabase } from 'expo-sqlite';

export const ExecuteQuery = (
  db: WebSQLDatabase,
  sql: string,
  params: (string | number)[] = [],
) =>
  new Promise<SQLResultSet>((resolve, reject) => {
    db.transaction((tnx) => {
      tnx.executeSql(
        sql,
        params,
        (trans, results) => {
          resolve(results);
        },
        (tnx, error) => {
          console.error(error);
          reject(undefined);
          return false;
        },
      );
    });
  });
