import { useNostr } from "nostr-react";
import {
  Event,
  getEventHash,
  getPublicKey,
  Kind,
  signEvent,
} from "nostr-tools";
import { useCallback, useEffect } from "react";
import { useStores } from "..";

const UserUpdater = (): null => {
  const { userStore } = useStores();
  const { profile, pubkey } = userStore;
  const { publish } = useNostr();

  const publishProfileCallback = useCallback(() => {
    if (!pubkey || !profile) return;

    const event: Event = {
      kind: Kind.Metadata,
      created_at: Math.floor(Date.now() / 1000),
      content: JSON.stringify(profile),
      pubkey: pubkey,
      tags: [],
    };

    event.id = getEventHash(event);
    event.sig = signEvent(event, userStore.key);
    publish(event);
  }, [profile, pubkey]);

  useEffect(() => publishProfileCallback, [profile, pubkey]);

  return null;
};

export default UserUpdater;
