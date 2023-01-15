import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "mobx-react";
import { NostrProvider } from "nostr-react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DEFAULT_RELAYS_URL } from "./constant/relay";
import Navigation from "./navigation";
import observableStore from "./store/user.store";

export default function App() {
  return (
    <NostrProvider relayUrls={DEFAULT_RELAYS_URL} debug={false}>
      <Provider observableStore={observableStore}>
        <NavigationContainer>
          <PaperProvider>
            <SafeAreaProvider>
              <Navigation />
            </SafeAreaProvider>
          </PaperProvider>
        </NavigationContainer>
      </Provider>
    </NostrProvider>
  );
}
