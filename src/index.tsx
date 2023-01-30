import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'mobx-react';
import { NostrProvider } from 'nostr-react';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PolyfillCrypto from 'react-native-webview-crypto';
import GenericModal from './components/Modal/GenericModal';
import { DEFAULT_RELAYS_URL } from './constant/relay';
import Navigation from './navigation';
import RootStore from './store';

// if (!global.randomBytes)
//   global.randomBytes = require('expo-random').getRandomBytes;

export default function App() {
  return (
    <>
      <PolyfillCrypto />
      <NostrProvider relayUrls={DEFAULT_RELAYS_URL} debug={false}>
        <Provider observableStore={RootStore}>
          <NavigationContainer>
            <PaperProvider>
              <SafeAreaProvider>
                <Navigation />
                <GenericModal />
              </SafeAreaProvider>
            </PaperProvider>
          </NavigationContainer>
        </Provider>
      </NostrProvider>
    </>
  );
}
