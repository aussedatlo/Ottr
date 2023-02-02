import { observer } from 'mobx-react';
import { NostrProvider as Provider, useNostr } from 'nostr-react';
import React, { useEffect } from 'react';
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

  onDisconnect((relay) => {
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
  });

  return null;
});

const NostrProvider = observer(({ children }: ThemeProviderProps) => {
  const { userStore } = useStores();

  useEffect(() => console.log(userStore.relays), [userStore.relays]);

  // TODO: don't do this, force the spash screen when store isn't loaded instead
  if (userStore.isLoaded)
    return (
      <Provider relayUrls={userStore.relays} debug={true}>
        <>{children}</>
        <NostrUpdater />
        <ContactUpdater />
        <MessageUpdater />
        <UserUpdater />
      </Provider>
    );

  return <>{children}</>;
});

export default NostrProvider;
