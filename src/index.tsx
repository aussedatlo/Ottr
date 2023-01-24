import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "mobx-react";
import { NostrProvider } from "nostr-react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DEFAULT_RELAYS_URL } from "./constant/relay";
import Navigation from "./navigation";
import RootStore from "./store";
import GenericModal from "./components/Modal/GenericModal";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import PolyfillCrypto from "react-native-webview-crypto";
import UserUpdater from "./store/user.updater";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);

if (!global.randomBytes)
  global.randomBytes = require("expo-random").getRandomBytes;

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
