import { useDatabaseContext } from '../context/DatabaseContext';
import { User } from '../types/user';

export function useUser(pubkey: string): User | undefined {
  const { allUsers } = useDatabaseContext();
  return allUsers.find((u) => u.pubkey === pubkey);
}

export function useUsers() {
  const { database, setAllUsers } = useDatabaseContext();

  async function refreshUsers() {
    console.log('REFRESH USERS');
    const results = await database.getAllUsers();
    setAllUsers(results);
  }

  async function updateUser(user: User): Promise<void> {
    console.log('UPDATE USER');
    const results = await database.updateUser(user);
    if (results.rowsAffected) await refreshUsers();
  }

  async function addUser(user: User): Promise<void> {
    console.log('ADD USER');
    const results = await database.addUser(user);
    if (results.rowsAffected) await refreshUsers();
  }

  return {
    updateUser,
    addUser,
  };
}
