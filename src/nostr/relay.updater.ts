import { useNostr } from 'nostr-react';
import { Relay } from 'nostr-tools';
import { useCallback } from 'react';

const RelayUpdater = (): null => {
  const { onDisconnect } = useNostr();

  const onDisconnectCallback = useCallback((relay: Relay) => {
    setTimeout(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      () => {
        relay
          .connect()
          .then(() => console.log(`reconnected: ${relay.url}`))
          .catch(() => console.log(`unable to reconnect: ${relay.url}`));
      },
      5000,
    );
  }, []);

  onDisconnect(onDisconnectCallback);

  return null;
};

export default RelayUpdater;
