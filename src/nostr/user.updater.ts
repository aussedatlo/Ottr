import { useNostr } from 'nostr-react';
import { Event, getEventHash, Kind, signEvent } from 'nostr-tools';
import { useCallback, useEffect, useRef } from 'react';
import { useUserContext } from '../context/UserContext';

const UserUpdater = (): null => {
  const { key, pubkey, user } = useUserContext();
  const { publish } = useNostr();
  const userRef = useRef(undefined);

  const publishProfileCallback = useCallback(() => {
    if (!key || !pubkey || !user || userRef.current === user) return;
    userRef.current = user;

    const event: Event = {
      kind: Kind.Metadata,
      created_at: Math.floor(Date.now() / 1000),
      content: JSON.stringify(user),
      pubkey: pubkey,
      tags: [],
    };

    event.id = getEventHash(event);
    event.sig = signEvent(event, key);
    publish(event);
  }, [user, userRef, pubkey, publish, key]);

  useEffect(() => {
    if (userRef) publishProfileCallback();
  }, [userRef, publishProfileCallback]);

  return null;
};

export default UserUpdater;
