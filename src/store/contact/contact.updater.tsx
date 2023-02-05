import { observer } from 'mobx-react';
import { useNostrEvents } from 'nostr-react';
import { Event, Kind } from 'nostr-tools';
import { useCallback } from 'react';
import { useStores } from '..';
import { Contact } from '../../types/contact';

const ContactUpdater = observer((): null => {
  const { contactStore } = useStores();
  const { contactList } = contactStore;

  // Update component when a new contact is added
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contactListLength = contactList.length;

  const metadataToBeFetch: Array<string> = contactList.reduce(
    (prev: Array<string>, curr: Contact) => [...prev, curr.pubkey],
    [],
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
