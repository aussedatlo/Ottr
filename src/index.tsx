import { NavigationContainer } from '@react-navigation/native';
import { Provider as StoreProvider } from 'mobx-react';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PolyfillCrypto from 'react-native-webview-crypto';
import GenericModal from './components/Modal/GenericModal';
import Navigation from './navigation';
import NostrProvider from './providers/NostrProvider';
import ThemeProvider from './providers/ThemeProvider';
import RootStore from './store';

export default function App() {
  return (
    <>
      <PolyfillCrypto />
      <StoreProvider observableStore={RootStore}>
        <NostrProvider>
          <NavigationContainer>
            <ThemeProvider>
              <SafeAreaProvider>
                <Navigation />
                <GenericModal />
              </SafeAreaProvider>
            </ThemeProvider>
          </NavigationContainer>
        </NostrProvider>
      </StoreProvider>
    </>
  );
}
