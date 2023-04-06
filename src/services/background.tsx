import * as BackgroundFetch from 'expo-background-fetch';
import * as SecureStore from 'expo-secure-store';
import * as TaskManager from 'expo-task-manager';
import { Event, getPublicKey, Kind, relayInit } from 'nostr-tools';
import { AppState, AppStateStatus } from 'react-native';
import { schedulePushNotificationAsync } from '../utils/notifications';
import {
  getBackgroundLocalStorage,
  getUserLocalStorage,
  setBackgroundLocalStorage,
} from '../utils/storage';
import { useEffect, useState } from 'react';

const BACKGROUND_FETCH_TASK = 'background-fetch';

export const BackgroudService = (): null => {
  const [_, setState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      'change',
      (nextAppState) => {
        setState((oldstate) => {
          console.log(`${oldstate} => ${nextAppState}`);

          if (nextAppState === 'active') {
            unregisterBackgroundFetchAsync();
          }

          if (nextAppState === 'background') {
            registerBackgroundFetchAsync();
            setBackgroundLocalStorage({
              lastMessageAt: Math.floor(Date.now() / 1000),
              connexionId: undefined,
            });
          }

          return nextAppState;
        });
      },
    );

    return () => appStateListener?.remove();
  }, [setState]);

  return null;
};

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  console.log(
    `[BACKGROUND]: Got background fetch call at date: ${new Date().toISOString()}`,
  );

  await schedulePushNotificationAsync({
    title: `background task lauched`,
    body: `${new Date().toISOString()}`,
  });

  const key = await SecureStore.getItemAsync('key', {});
  const pubkey = getPublicKey(key);

  const { relays } = await getUserLocalStorage();
  const { lastMessageAt } = await getBackgroundLocalStorage();

  const relay = relayInit(relays[0]);

  relay.on('connect', () =>
    console.log(`[BACKGROUND]: connect relay ${relay.url}`),
  );
  relay.on('disconnect', () => {
    console.log(`[BACKGROUND]: disconnect relay ${relay.url}`);
  });

  await relay.connect();

  const sub = relay.sub([
    {
      kinds: [Kind.EncryptedDirectMessage],
      '#p': [pubkey],
      since: lastMessageAt + 1,
    },
  ]);

  sub.on('event', async (event: Event) => {
    console.log(`[BACKGROUND]: get event ${event.id}`);
    await schedulePushNotificationAsync({
      title: `✉️ You've got a message from ${event.pubkey.slice(0, 8)}`,
      body: event.content,
    });
  });

  sub.on('eose', () => {
    console.log(`[BACKGROUND]: get eose, closing relay connexion`);
    setBackgroundLocalStorage({
      lastMessageAt: Math.floor(Date.now() / 1000),
      connexionId: undefined,
    });
    relay.close();
  });

  console.log('[BACKGROUND]: done');
});

export async function registerBackgroundFetchAsync() {
  console.log('register background task');

  BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 1,
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

async function unregisterBackgroundFetchAsync() {
  console.log('unregister background task');
  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    BACKGROUND_FETCH_TASK,
  );

  if (isRegistered) BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}
