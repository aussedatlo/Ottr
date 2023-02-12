import { useNostr } from 'nostr-react';
import { Relay } from 'nostr-tools';
import { useCallback } from 'react';
import { useUserContext } from '../context/UserContext';

const RelayUpdater = (): null => {
  const { isLoaded, relays } = useUserContext();
  const { onDisconnect } = useNostr();

  const onDisconnectCallback = useCallback(
    (relay: Relay) => {
      if (!isLoaded) return;

      setTimeout(
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        () => {
          if (relays.includes(relay.url))
            relay
              .connect()
              .then(() => console.log(`reconnected: ${relay.url}`))
              .catch(() => console.log(`unable to reconnect: ${relay.url}`));
        },
        30000,
      );
    },
    [relays, isLoaded],
  );

  onDisconnect(onDisconnectCallback);

  return null;
};

export default RelayUpdater;
