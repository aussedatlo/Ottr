import * as BackgroundFetch from 'expo-background-fetch';
import * as SecureStore from 'expo-secure-store';
import * as TaskManager from 'expo-task-manager';
import { getPublicKey, Kind } from 'nostr-tools';
import { AppState, AppStateStatus } from 'react-native';
import { schedulePushNotificationAsync } from '../utils/notifications';
import {
  getBackgroundLocalStorage,
  getUserLocalStorage,
  setBackgroundLocalStorage,
} from '../utils/storage';

const BACKGROUND_FETCH_TASK = 'background-fetch';
let appState: AppStateStatus;

AppState.addEventListener('change', async (nextAppState) => {
  if (!appState ||
    (appState.match(/inactive|background/) && nextAppState === 'active')

  ) {
    console.log('App has come to the foreground!');
    const { lastMessageAt, connexionId } = await getBackgroundLocalStorage();
    await setBackgroundLocalStorage({ lastMessageAt, connexionId: undefined });

    // ensure the previous background connexion is closed
    const { relays } = await getUserLocalStorage();
    const ws = new WebSocket(relays[0]);
    ws.send(JSON.stringify(['CLOSE', connexionId]));
  }

  if (appState === 'active' && nextAppState.match(/inactive|background/)) {
    console.log('App comming to background!');
  }

  appState = nextAppState;
});

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  console.log(
    `[BACKGROUND]: Got background fetch call at date: ${new Date().toISOString()}`,
  );

  const key = await SecureStore.getItemAsync('key', {});
  const pubkey = getPublicKey(key);

  const { relays } = await getUserLocalStorage();
  const { lastMessageAt, connexionId } = await getBackgroundLocalStorage();

  console.log(`[BACKGROUND]: connexion id: ${JSON.stringify(connexionId)}`);

  if (connexionId) return;

  const newConnexionId = Math.random().toString().slice(2);
  await setBackgroundLocalStorage({
    lastMessageAt,
    connexionId: newConnexionId,
  });

  const ws = new WebSocket(relays[0]);

  ws.onopen = (e) => {
    ws.send(
      JSON.stringify([
        'REQ',
        newConnexionId,
        {
          kinds: [Kind.EncryptedDirectMessage],
          since: lastMessageAt || Math.floor(Date.now() / 1000),
          '#p': [pubkey],
        },
      ]),
    );
  };

  ws.onclose = async (e) => {
    console.log('CLOSE');
    const { lastMessageAt } = await getBackgroundLocalStorage();
    await setBackgroundLocalStorage({ lastMessageAt, connexionId: undefined });
  };

  ws.onmessage = async (e) => {
    console.log(`MESSAGE`);

    if (e.data.includes('EVENT')) {
      console.log('NEW EVENT');
      await schedulePushNotificationAsync({
        title: `✉️ You've got a message from ${e.data[2].pubkey.slice(0,8)}`,
        body: e.data[2].content,
      });
    }

    if (e.data.includes('EOSE')) {
      console.log('EOSE');
      const lastMessageAt = Math.floor(Date.now() / 1000);
      console.log(lastMessageAt);
      const { connexionId } = await getBackgroundLocalStorage();
      await setBackgroundLocalStorage({
        lastMessageAt,
        connexionId,
      });
      // ws.send(JSON.stringify(['CLOSE', connexionId]));
      // ws.close();
    }
  };

  console.log('[BACKGROUND]: done');
});

export async function registerBackgroundFetchAsync() {
  try {
    await unregisterBackgroundFetchAsync();
  } catch (e) {
    console.error(e);
  }
  console.log('register background task');

  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 1,
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}
