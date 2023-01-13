import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "mobx-react";
import { NostrProvider } from "nostr-react";
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppBar from "./components/AppBar";
import { DEFAULT_RELAYS_URL } from "./constant/relay";
import HomeScreen from "./screens/Home";
import IntroScreen from "./screens/Intro";
import ProfileScreen from "./screens/Profile";
import SettingsScreen from "./screens/Settings";
import observableStore from "./store/user.store";

export type RootStackParamList = {
  Home: undefined;
  Intro: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NostrProvider relayUrls={DEFAULT_RELAYS_URL} debug={true}>
      <Provider observableStore={observableStore}>
        <NavigationContainer>
          <PaperProvider>
            <SafeAreaProvider>
              <Stack.Navigator
                initialRouteName="Intro"
                screenOptions={{
                  header: (props) => <AppBar {...props} />,
                }}
              >
                <Stack.Screen name="Intro" component={IntroScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
              </Stack.Navigator>
            </SafeAreaProvider>
          </PaperProvider>
        </NavigationContainer>
      </Provider>
    </NostrProvider>
  );
}
