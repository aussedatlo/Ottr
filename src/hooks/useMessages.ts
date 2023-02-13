import { useDatabaseContext } from '../context/DatabaseContext';
import {
  getAllMessages,
  addMessage as dbAddMessage,
  updateMessage as dbUpdateMessage,
} from '../database/functions/messages';
import { Message } from '../types/message';

export function useMessages() {
  const { database, setAllMessages } = useDatabaseContext();

  function refreshMessages() {
    console.log('REFRESH MESSAGES');
    return getAllMessages(database).then(setAllMessages);
  }

  async function addMessage(message: Message): Promise<void> {
    console.log('ADD MESSAGE');
    const results = await dbAddMessage(database, message);
    if (results.rowsAffected) await refreshMessages();
  }

  async function updateMessage(message: Message): Promise<void> {
    console.log('SET PENDING');
    const results = await dbUpdateMessage(database, message);
    if (results.rowsAffected) await refreshMessages();
  }

  return {
    addMessage,
    updateMessage,
  };
}
