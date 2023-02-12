import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PolyfillCrypto from 'react-native-webview-crypto';
import DatabaseContextProvider from './context/DatabaseContext';
import UserContextProvider from './context/UserContext';
import Navigation from './navigation';
import NostrProvider from './providers/NostrProvider';
import ThemeProvider from './providers/ThemeProvider';

export default function App() {
  return (
    <SafeAreaProvider>
      <PolyfillCrypto />
      <UserContextProvider>
        <DatabaseContextProvider>
          <NostrProvider>
            <ThemeProvider>
              <Navigation />
            </ThemeProvider>
          </NostrProvider>
        </DatabaseContextProvider>
      </UserContextProvider>
    </SafeAreaProvider>
  );
}
