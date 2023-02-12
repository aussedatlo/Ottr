import { NostrProvider as Provider } from 'nostr-react';
import React from 'react';
import { useUserContext } from '../context/UserContext';
import ContactUpdater from '../nostr/contact.updater';
import MessageUpdater from '../nostr/message.updater';
import RelayUpdater from '../nostr/relay.updater';
import UserUpdater from '../nostr/user.updater';

type ThemeProviderProps = {
  children: React.ReactNode;
};

const NostrProvider = ({ children }: ThemeProviderProps) => {
  const { key, pubkey, relays } = useUserContext();

  return (
    <Provider relayUrls={relays || []} debug={true}>
      <>{children}</>

      {!key || !pubkey ? (
        <></>
      ) : (
        <>
          <RelayUpdater />
          <ContactUpdater />
          <MessageUpdater />
          <UserUpdater />
        </>
      )}
    </Provider>
  );
};

export default NostrProvider;
