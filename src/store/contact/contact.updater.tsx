import { useNostrEvents } from 'nostr-react';
import { Event, Kind } from 'nostr-tools';
import { useCallback, useMemo } from 'react';
import { useStores } from '..';

const ContactUpdater = (): null => {
  const { contactStore, messageStore } = useStores();
  const { messageList } = messageStore;
  const { contactList } = contactStore;

  const metadataToBeFetch: Array<string> = useMemo(
    () =>
      Object.keys(messageList).reduce((previous, pubkey) => {
        const contact = contactList.filter(
          (value) => value.pubkey === pubkey,
        )[0];
        if (!contact || (!!contact && !contact.about && !contact.picture))
          return [...previous, pubkey];
        return previous;
      }, []),
    [contactList, messageList],
  );

  const { onEvent } = useNostrEvents({
    filter: { kinds: [Kind.Metadata], authors: metadataToBeFetch },
  });

  const onEventCallback = useCallback((event: Event) => {
    const { name, about, picture } = JSON.parse(event.content);
    contactStore.addContact({
      pubkey: event.pubkey,
      name: name,
      about: about,
      picture: picture,
    });
  }, []);

  onEvent(onEventCallback);

  return null;
};

export default ContactUpdater;
