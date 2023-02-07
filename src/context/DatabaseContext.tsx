import React, { useState } from 'react';
import { QuickSQLiteConnection } from 'react-native-quick-sqlite';
import SInfo from 'react-native-sensitive-info';
import { initDatabase } from '../database';

export type DatabaseContext = {
  init: () => void;
  loadingDb: boolean;
  database: QuickSQLiteConnection | null;
};

export type DatabaseContextProviderProps = {
  children: React.ReactNode;
};

export const initialDatabaseContext: DatabaseContext = {
  init: () => {},
  loadingDb: true,
  database: null,
};

export const DatabaseContext = React.createContext(initialDatabaseContext);

export const DatabaseContextProvider = ({
  children,
}: DatabaseContextProviderProps): React.ReactElement => {
  const [database, setDatabase] = useState<QuickSQLiteConnection | null>(
    initialDatabaseContext.database,
  );
  const [loadingDb, setLoadingDb] = useState<boolean>(
    initialDatabaseContext.loadingDb,
  );
  const init = () => {
    const db = initDatabase();
    setDatabase(db);
    setLoadingDb(false);
  };

  return (
    <DatabaseContext.Provider value={{ init, loadingDb, database }}>
      {children}
    </DatabaseContext.Provider>
  );
};
