import { useDatabaseContext } from '../context/DatabaseContext';
import {
  addMessage as dbAddMessage,
  addReaction as dbAddReaction,
  addOtherReaction as dbAddOtherReaction,
  getAllMessages,
  updateMessage as dbUpdateMessage,
} from '../database/functions/messages';
import { Message } from '../types/message';
import { Reaction } from '../types/reaction';

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

  async function addReaction(
    messageId: string,
    reaction: Reaction,
  ): Promise<void> {
    console.log('ADD REACTION');
    const results = await dbAddReaction(database, messageId, reaction);
    if (results.rowsAffected) await refreshMessages();
  }

  async function addOtherReaction(
    messageId: string,
    reaction: Reaction,
  ): Promise<void> {
    console.log('ADD OTHER REACTION');
    const results = await dbAddOtherReaction(database, messageId, reaction);
    if (results.rowsAffected) await refreshMessages();
  }

  return {
    addMessage,
    updateMessage,
    addReaction,
    addOtherReaction,
  };
}
