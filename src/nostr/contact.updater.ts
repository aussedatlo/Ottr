import { useNostrEvents } from 'nostr-react';
import { Event, Kind } from 'nostr-tools';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDatabaseContext } from '../context/DatabaseContext';
import { useUserContext } from '../context/UserContext';
import { useUsers } from '../hooks/useUsers';
import { User } from '../types/user';

const ContactUpdater = (): null => {
  const { updateUser } = useUsers();
  const { allUsers } = useDatabaseContext();
  const { pubkey } = useUserContext();
  const [pubkeysToFetch, setPubkeysToFetch] = useState<Array<string>>([]);
  const allUsersLengthRef = useRef(0);

  useEffect(() => {
    if (allUsers.length === 0 || allUsers.length === allUsersLengthRef.current)
      return;

    const pubkeysToFetch: Array<string> = allUsers.reduce(
      (prev: Array<string>, curr: User) =>
        prev.includes(curr.pubkey) || curr.pubkey === pubkey
          ? prev
          : [...prev, curr.pubkey],
      [],
    );

    allUsersLengthRef.current = allUsers.length;
    setPubkeysToFetch(pubkeysToFetch);
  }, [allUsers, allUsersLengthRef, pubkey]);

  const { onEvent } = useNostrEvents({
    filter: { kinds: [Kind.Metadata], authors: pubkeysToFetch },
  });

  const onEventCallback = useCallback(
    async (event: Event) => {
      try {
        let user = JSON.parse(event.content) as User;
        user.pubkey = event.pubkey;
        await updateUser(user);
      } catch {
        console.error('unable to parse metadata event');
      }
    },
    [updateUser],
  );

  onEvent(onEventCallback);

  return null;
};

export default ContactUpdater;
