import { useDatabaseContext } from '../context/DatabaseContext';
import { Message } from '../types/message';

export function useMessages() {
  const { database, setAllMessages } = useDatabaseContext();

  function refreshMessages() {
    console.log('REFRESH MESSAGES');
    return database.getAllMessages().then(setAllMessages);
  }

  async function addMessage(message: Message): Promise<void> {
    console.log('ADD MESSAGE');
    const [results] = await database.addMessage(message);
    if (results.rowsAffected) await refreshMessages();
  }

  async function updateMessage(message: Message): Promise<void> {
    console.log('SET PENDING');
    const [results] = await database.updateMessage(message);
    if (results.rowsAffected) await refreshMessages();
  }

  return {
    addMessage,
    updateMessage,
  };
}
