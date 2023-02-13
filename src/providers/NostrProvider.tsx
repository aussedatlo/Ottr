import { NostrProvider as Provider } from 'nostr-react';
import React from 'react';
import { useDatabaseContext } from '../context/DatabaseContext';
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
  const { isLoaded } = useDatabaseContext();

  if (!key || !pubkey || !relays || !isLoaded) return <>{children}</>;

  return (
    <Provider relayUrls={relays || []} debug={true}>
      <>{children}</>
      <>
        <RelayUpdater />
        <ContactUpdater />
        <MessageUpdater />
        <UserUpdater />
      </>
    </Provider>
  );
};

export default NostrProvider;
