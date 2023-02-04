import { observer } from 'mobx-react';
import { useNostrEvents } from 'nostr-react';
import { Event, Kind, nip04 } from 'nostr-tools';
import React, { useCallback } from 'react';
import { useStores } from '..';

const ReceiveMessageUpdater = observer((): null => {
  const { userStore, messageStore, contactStore } = useStores();
  const { onEvent } = useNostrEvents({
    filter: {
      kinds: [Kind.EncryptedDirectMessage],
      since: messageStore.lastReceiveFromStart,
      '#p': [userStore.pubkey],
    },
  });

  const onEventCallback = useCallback(
    async (event: Event) => {
      console.log(`event detected ${event.id}`);
      const content = await nip04.decrypt(
        userStore.key,
        event.pubkey,
        event.content,
      );
      messageStore.addMessage(event.pubkey, {
        id: event.id,
        content: content,
        created_at: event.created_at,
        pubkey: event.pubkey,
        isSend: true,
        isSender: false,
      });

      contactStore.addContact({
        pubkey: event.pubkey,
      });
    },
    [contactStore, messageStore, userStore.key],
  );

  onEvent(onEventCallback);
  return null;
});

const SendMessageUpdater = observer((): null => {
  const { userStore, messageStore } = useStores();
  const { onEvent } = useNostrEvents({
    filter: {
      kinds: [Kind.EncryptedDirectMessage],
      since: messageStore.lastSendFromStart,
      authors: [userStore.pubkey],
    },
  });

  const onEventCallback = useCallback(
    (event: Event) => {
      console.log(`event sent detected ${event.id}`);
      messageStore.updateMessage(event.tags[0][1], event.id, event.created_at);
    },
    [messageStore],
  );

  onEvent(onEventCallback);

  return null;
});

const MessageUpdater = () => (
  <>
    <ReceiveMessageUpdater />
    <SendMessageUpdater />
  </>
);

export default MessageUpdater;
