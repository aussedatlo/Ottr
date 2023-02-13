import { openDatabase, WebSQLDatabase } from 'expo-sqlite';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { getAllMessages } from '../database/functions/messages';
import { getAllUsers } from '../database/functions/user';
import { initDatabase } from '../database/init';
import { Message } from '../types/message';
import { User } from '../types/user';
import { useUserContext } from './UserContext';

type DatabaseContextProps = {
  database: WebSQLDatabase;
  allMessages: Array<Message>;
  setAllMessages: (allMessages: Array<Message>) => void;
  allUsers: Array<User>;
  setAllUsers: (allUsers: Array<User>) => void;
  lastEvent: number;
  isLoaded: boolean;
};

const DatabaseContext = React.createContext<DatabaseContextProps | undefined>(
  undefined,
);

type DatabaseContextProviderProps = {
  children: React.ReactElement;
};

const DatabaseContextProvider = ({
  children,
}: DatabaseContextProviderProps) => {
  const [allMessages, setAllMessages] = useState<Array<Message>>([]);
  const [allUsers, setAllUsers] = useState<Array<User>>([]);
  const [lastEvent, setLastEvent] = useState<number>(0);
  const lastEventRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { key, isLoaded: isUserContextLoaded } = useUserContext();
  const [db, setDb] = useState<WebSQLDatabase>(undefined);

  // init database
  useEffect(() => {
    const init = async () => {
      const db = openDatabase('ottr.sql');
      await initDatabase(db);
      setDb(db);
    };

    init();
  }, []);

  // init messages and users
  useEffect(() => {
    const init = async () => {
      setAllUsers(await getAllUsers(db));
      const allMessages = await getAllMessages(db);
      setAllMessages(allMessages);
      if (allMessages.length === 0) setLastEvent(1);
      setIsLoaded(true);
    };

    if (!isUserContextLoaded || !db) return;
    if (key) init();
    else {
      // initialize empty arrays
      // in case of logout
      setAllMessages([]);
      setAllUsers([]);
      setLastEvent(1);
      setIsLoaded(true);
    }
  }, [key, isUserContextLoaded, db]);

  // init last event ref
  useEffect(() => {
    if (lastEventRef.current !== 0 || allMessages.length === 0) {
      return;
    }

    lastEventRef.current = allMessages[0].created_at;
    setLastEvent(lastEventRef.current);
  }, [lastEventRef, allMessages]);

  return (
    <DatabaseContext.Provider
      value={{
        database: db,
        allMessages,
        setAllMessages,
        allUsers,
        setAllUsers,
        lastEvent,
        isLoaded,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export function useDatabaseContext() {
  const database = useContext(DatabaseContext);
  if (database === undefined) {
    throw new Error('useDatabase must be used within a ListContextProvider');
  }
  return database;
}

export default DatabaseContextProvider;
