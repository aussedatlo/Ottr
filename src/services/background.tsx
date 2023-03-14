import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';
import { getPublicKey, Kind, Relay, relayInit } from 'nostr-tools';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocalStorage, setLocalStorage } from '../utils/storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function schedulePushNotification() {
  await Notifications.getPermissionsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 1 },
  });
}

const BACKGROUND_FETCH_TASK = 'background-fetch';

async function sleep(time) {
  return new Promise((r, _) => setTimeout(r, time));
}

async function list(relay: Relay): Promise<Event[]> {
  return new Promise((r, _) =>
    relay.list([{ kinds: [Kind.EncryptedDirectMessage], since: 1678786580 }]),
  );
}

// 1. Define the task by providing a name and the function that should be executed
// Note: This needs to be called in the global scope (e.g outside of your React components)
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const key = await SecureStore.getItemAsync('key', {});
  const pubkey = getPublicKey(key);

  const storageData = await getLocalStorage('background', {
    lastEventAt: Math.floor(Date.now() / 1000),
  });

  const ws = new WebSocket('ws://192.168.133.20:8008');

  ws.onclose = (e) => console.log('CLOSE');
  ws.onmessage = async (e) => {
    console.log(`MESSAGE`);
    console.log(e.data);

    if (e.data.includes('EVENT')) {
      console.log('NEW EVENT');
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "You've got mail! 📬",
          body: 'Here is the notification body',
          data: { data: 'goes here' },
        },
        trigger: { seconds: 1 },
      });
    }

    if (e.data.includes('EOSE')) {
      console.log('EOSE');
      const lastEventAt = Math.floor(Date.now() / 1000);
      console.log(lastEventAt);
      await setLocalStorage('background', {
        lastEventAt: lastEventAt,
      });
      ws.send(JSON.stringify(['CLOSE', '13727284645432092']));
      ws.close();
    }
  };
  ws.onopen = (e) => {
    console.log('OPEN');
    ws.send(
      JSON.stringify([
        'REQ',
        // Math.random().toString().slice(2),
        '13727284645432092',
        {
          kinds: [Kind.EncryptedDirectMessage],
          since: storageData.lastEventAt,
          '#p': [pubkey],
        },
      ]),
    );
  };

  //   await relay.connect();

  //   const sub = await list(relay);
  //   console.log(`[BACKGROUND]: after list`);
  //   return BackgroundFetch.BackgroundFetchResult.NewData;

  console.log(
    `[BACKGROUND]: Got background fetch call at date: ${new Date().toISOString()}`,
  );

  //   await new Promise(r => {setTimeout(() => console.log("[BACKGROUND]: Timeout done"), 2000)});
  //   setTimeout(() => console.log('[BACKGROUND]: Timeout done'), 2000);
  //   for (let i = 0; i < 30; i++) {
  //     console.log(`[BACKGROUND]: iteration ${i}`);
  //   }

  //   schedulePushNotification();

  console.log('[BACKGROUND]: done');

  // Be sure to return the successful result type!
  //   return BackgroundFetch.BackgroundFetchResult.NewData;
});

// 2. Register the task at some point in your app by providing the same name,
// and some configuration options for how the background fetch should behave
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
export async function registerBackgroundFetchAsync() {
  try {
    await unregisterBackgroundFetchAsync();
  } catch (e) {
    console.error(e);
  }
  console.log('register background task');

  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 60 * 1, // 1 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

// 3. (Optional) Unregister tasks by specifying the task name
// This will cancel any future background fetch calls that match the given name
// Note: This does NOT need to be in the global scope and CAN be used in your React components!
async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}
