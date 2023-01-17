import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "mobx-react";
import { NostrProvider } from "nostr-react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DEFAULT_RELAYS_URL } from "./constant/relay";
import Navigation from "./navigation";
import observableStore from "./store/user.store";
import GenericModal from "./components/Modal/GenericModal";

import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);

export default function App() {
  return (
    <NostrProvider relayUrls={DEFAULT_RELAYS_URL} debug={false}>
      <Provider observableStore={observableStore}>
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
  );
}
