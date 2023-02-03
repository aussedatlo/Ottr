import { observer } from 'mobx-react';
import { NostrProvider as Provider, useNostr } from 'nostr-react';
import React, { useCallback } from 'react';
import { useStores } from '../store';
import ContactUpdater from '../store/contact/contact.updater';
import MessageUpdater from '../store/message/message.updater';
import UserUpdater from '../store/user/user.updater';

type ThemeProviderProps = {
  children: React.ReactNode;
};

const NostrUpdater = observer((): null => {
  const { userStore } = useStores();
  const { onDisconnect } = useNostr();

  const onDisconnectCallback = useCallback(
    (relay) => {
      if (!userStore.isLoaded) return;

      setTimeout(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        () => {
          if (userStore.relays.includes(relay.url))
            relay
              .connect()
              .then(() => console.log(`reconnected: ${relay.url}`))
              .catch(() => console.log(`unable to reconnect: ${relay.url}`));
        },
        30000,
      );
    },
    [userStore.relays, userStore.isLoaded],
  );

  onDisconnect(onDisconnectCallback);

  return null;
});

const NostrProvider = observer(({ children }: ThemeProviderProps) => {
  const { userStore } = useStores();

  return (
    <Provider relayUrls={userStore.relays} debug={true}>
      <>{children}</>
      <NostrUpdater />
      <ContactUpdater />
      <MessageUpdater />
      <UserUpdater />
    </Provider>
  );
});

export default NostrProvider;
