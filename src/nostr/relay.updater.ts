import { useNostr } from 'nostr-react';
import { Relay } from 'nostr-tools';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useUserContext } from '../context/UserContext';

const NUMBER_OF_RETRY = 5;
const TEN_SECONDS_MS = 10 * 1000;

const RelayUpdater = (): null => {
  const { onDisconnect } = useNostr();
  const { relays } = useUserContext();
  const relaysRef = useRef(relays);
  const [timers, setTimers] = useState<{ [key: string]: NodeJS.Timeout[] }>({});

  const clearRelayTimer = useCallback(
    (relayUrl: string) => {
      setTimers((state) => {
        const newState = { ...state };
        newState[relayUrl]?.forEach((timer) => clearTimeout(timer));
        newState[relayUrl] = [];
        return newState;
      });
    },
    [setTimers],
  );

  useEffect(() => {
    if (relaysRef.current === relays) return;

    relaysRef.current = relays;
    Object.keys(timers).forEach(clearRelayTimer);
  }, [relaysRef, relays, timers, clearRelayTimer]);

  const onDisconnectCallback = useCallback(
    (relay: Relay) => {
      setTimers((state) => {
        const nbTry = (state[relay.url] || []).length;
        if (nbTry > NUMBER_OF_RETRY) return state;

        const newState = { ...state };

        const timer = setTimeout(
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          () => {
            relay
              .connect()
              .then(() => {
                console.log(`reconnected: ${relay.url}`);
                clearRelayTimer(relay.url);
              })
              .catch(() => console.error(`unable to reconnect: ${relay.url}`));
          },
          TEN_SECONDS_MS * nbTry,
        );

        newState[relay.url] = [...(newState[relay.url] || []), timer];
        return newState;
      });
    },
    [setTimers, clearRelayTimer],
  );

  onDisconnect(onDisconnectCallback);

  return null;
};

export default RelayUpdater;
