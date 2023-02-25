import { useDatabaseContext } from '../context/DatabaseContext';
import {
  addUser as dbAddUser,
  getAllUsers,
  updateUser as dbUpdateUser,
  updateUserLastEventAt as dbUpdateUserLastEventAt,
} from '../database/functions/user';
import { User } from '../types/user';

export function useUser(pubkey: string): User | undefined {
  const { allUsers } = useDatabaseContext();
  return allUsers.find((u) => u.pubkey === pubkey);
}

export function useUsers() {
  const { database, setAllUsers } = useDatabaseContext();

  async function refreshUsers() {
    console.log('REFRESH USERS');
    const results = await getAllUsers(database);
    setAllUsers(results);
  }

  async function updateUser(user: User): Promise<void> {
    console.log('UPDATE USER');
    const results = await dbUpdateUser(database, user);
    if (results.rowsAffected) await refreshUsers();
  }

  async function addUser(user: User): Promise<void> {
    console.log('ADD USER');
    const results = await dbAddUser(database, user);
    if (results.rowsAffected) await refreshUsers();
  }

  async function updateUserLastEventAt(user: User): Promise<void> {
    console.log('UPDATE USER LAST EVENT AT');
    const results = await dbUpdateUserLastEventAt(database, user);
    if (results.rowsAffected) await refreshUsers();
  }

  return {
    updateUser,
    updateUserLastEventAt,
    addUser,
  };
}
