import { observer } from 'mobx-react';
import { useNostrEvents } from 'nostr-react';
import { Event, Kind } from 'nostr-tools';
import { useCallback, useMemo } from 'react';
import { useStores } from '..';
import { Contact } from '../../types/contact';

const ContactUpdater = observer((): null => {
  const { contactStore, messageStore } = useStores();
  const { messageList } = messageStore;
  const { contactList } = contactStore;
  const contacts = messageList?.keys();

  const metadataToBeFetch: Array<string> = useMemo(
    () =>
      [...contacts].reduce((previous: Array<string>, pubkey: string) => {
        const contact = contactList.filter(
          (value) => value.pubkey === pubkey,
        )[0];
        if (!contact || (!!contact && !contact.about && !contact.picture))
          return [...previous, pubkey];
        return previous;
      }, []),
    [contactList, contacts],
  );

  const { onEvent } = useNostrEvents({
    filter: { kinds: [Kind.Metadata], authors: metadataToBeFetch },
  });

  const onEventCallback = useCallback(
    (event: Event) => {
      try {
        const { name, about, picture } = JSON.parse(event.content) as Contact;
        contactStore.addContact({
          pubkey: event.pubkey,
          name: name,
          about: about,
          picture: picture,
        });
      } catch {
        console.error('unable to parse metadata event');
      }
    },
    [contactStore],
  );

  onEvent(onEventCallback);

  return null;
});

export default ContactUpdater;
