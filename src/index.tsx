import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'mobx-react';
import { NostrProvider } from 'nostr-react';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PolyfillCrypto from 'react-native-webview-crypto';
import GenericModal from './components/Modal/GenericModal';
import { DEFAULT_RELAYS_URL } from './constant/relay';
import Navigation from './navigation';
import ThemeProvider from './providers/ThemeProvider';
import RootStore from './store';

export default function App() {
  return (
    <>
      <PolyfillCrypto />
      <NostrProvider relayUrls={DEFAULT_RELAYS_URL} debug={true}>
        <Provider observableStore={RootStore}>
          <NavigationContainer>
            <ThemeProvider>
              <SafeAreaProvider>
                <Navigation />
                <GenericModal />
              </SafeAreaProvider>
            </ThemeProvider>
          </NavigationContainer>
        </Provider>
      </NostrProvider>
    </>
  );
}
