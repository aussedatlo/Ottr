import { useNostrEvents } from "nostr-react";
import { Event, getPublicKey, Kind, nip04 } from "nostr-tools";
import { useCallback } from "react";
import { useStores } from ".";

const ReceiveMessageUpdater = (): null => {
  const { userStore } = useStores();
  const { onEvent } = useNostrEvents({
    filter: {
      kinds: [Kind.EncryptedDirectMessage],
      since: userStore.lastReceiveFromStart,
      limit: 1,
      "#p": [getPublicKey(userStore.key)],
    },
  });

  const onEventCallback = useCallback(async (event: Event) => {
    console.log(`event detected ${event.id}`);
    const content = await nip04.decrypt(
      userStore.key,
      event.pubkey,
      event.content
    );
    userStore.addMessage(event.pubkey, {
      id: event.id,
      content: content,
      created_at: event.created_at,
      pubkey: event.pubkey,
      isSend: true,
    });
  }, []);

  onEvent(onEventCallback);
  return null;
};

const SendMessageUpdater = (): null => {
  const { userStore } = useStores();
  const { onEvent } = useNostrEvents({
    filter: {
      kinds: [Kind.EncryptedDirectMessage],
      since: userStore.lastSendFromStart,
      authors: [getPublicKey(userStore.key)],
    },
  });

  const onEventCallback = useCallback(async (event: Event) => {
    console.log(`event sent detected ${event.id}`);
    userStore.updateMessage(event.tags[0][1], event.id, event.created_at);
  }, []);

  onEvent(onEventCallback);

  return null;
};

const UserUpdater = () => (
  <>
    <ReceiveMessageUpdater />
    <SendMessageUpdater />
  </>
);

export default UserUpdater;
