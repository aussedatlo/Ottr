import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PolyfillCrypto from 'react-native-webview-crypto';
import GenericModal from './components/Modal/GenericModal';
import Navigation from './navigation';
import NostrProvider from './providers/NostrProvider';
import StoreProvider from './providers/StoreProvider';
import ThemeProvider from './providers/ThemeProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <PolyfillCrypto />
      <StoreProvider>
        <NostrProvider>
          <ThemeProvider>
            <Navigation />
            <GenericModal />
          </ThemeProvider>
        </NostrProvider>
      </StoreProvider>
    </SafeAreaProvider>
  );
}
