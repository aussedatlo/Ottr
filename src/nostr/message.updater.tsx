import { dateToUnix, useNostrEvents } from 'nostr-react';
import { Event, Kind, nip04 } from 'nostr-tools';
import React, { useCallback } from 'react';
import { useDatabaseContext } from '../context/DatabaseContext';
import { useUserContext } from '../context/UserContext';
import { useMessages } from '../hooks/useMessages';
import { useUsers } from '../hooks/useUsers';

const ReceiveMessageUpdater = (): null => {
  const { key, pubkey } = useUserContext();
  const { addUser } = useUsers();
  const { lastEvent } = useDatabaseContext();
  const since = lastEvent === 0 ? dateToUnix() : lastEvent;
  const { addMessage } = useMessages();

  const { onEvent } = useNostrEvents({
    filter: {
      kinds: [Kind.EncryptedDirectMessage],
      since: since,
      '#p': [pubkey],
    },
  });

  const onEventCallback = useCallback(
    async (event: Event) => {
      if (!key || !pubkey) return;

      console.log(`event detected ${event.id}`);
      await addMessage({
        ...event,
        pending: false,
        seen: false,
        content: await nip04.decrypt(key, event.pubkey, event.content),
      });

      await addUser({
        pubkey: event.pubkey,
      });
    },
    [addMessage, addUser, key, pubkey],
  );

  onEvent(onEventCallback);
  return null;
};

const SendMessageUpdater = (): null => {
  const { pubkey } = useUserContext();
  const { lastEvent } = useDatabaseContext();
  const since = lastEvent === 0 ? dateToUnix() : lastEvent;
  const { onEvent } = useNostrEvents({
    filter: {
      kinds: [Kind.EncryptedDirectMessage],
      since: since,
      authors: [pubkey],
    },
  });
  const { updateMessage } = useMessages();

  const onEventCallback = useCallback(
    async (event: Event) => {
      console.log(`event sent detected ${event.id}`);
      await updateMessage({ ...event, pending: false, seen: true });
    },
    [updateMessage],
  );

  onEvent(onEventCallback);

  return null;
};

const MessageUpdater = () => (
  <>
    <ReceiveMessageUpdater />
    <SendMessageUpdater />
  </>
);

export default MessageUpdater;
