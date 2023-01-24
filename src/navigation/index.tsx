import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { observer } from "mobx-react";
import { useNostr } from "nostr-react";
import { useTheme } from "react-native-paper";
import AppBar from "../components/AppBar";
import HomeScreen from "../screens/Home";
import IntroScreen from "../screens/Intro";
import PostScreen from "../screens/Post";
import ProfileScreen from "../screens/Profile";
import SelectContactScreen from "../screens/SelectContact";
import SettingsScreen from "../screens/Settings";
import SplashScreen from "../screens/Splash";
import TalkScreen from "../screens/Talk";
import { useStores } from "../store";
import UserUpdater from "../store/user.updater";

export type RootStackParamList = {
  Home: undefined;
  Intro: undefined;
  Post: undefined;
  Profile: undefined;
  SelectContact: undefined;
  Settings: undefined;
  Talk: { pub: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = observer(() => {
  const { userStore } = useStores();
  const { colors } = useTheme();

  const { onDisconnect } = useNostr();

  onDisconnect((relay) => {
    setTimeout(
      () =>
        relay
          .connect()
          .then((data) => console.log(`reconnected: ${relay.url}`))
          .catch((error) => console.log(`unable to reconnect: ${relay.url}`)),
      10000
    );
  });

  if (userStore.isLoaded)
    return (
      <>
        <Stack.Navigator
          initialRouteName={!userStore.key ? "Intro" : "Home"}
          screenOptions={{
            header: (props) => <AppBar {...props} />,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Post" component={PostScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="SelectContact" component={SelectContactScreen} />
          <Stack.Screen name="Talk" component={TalkScreen} />
        </Stack.Navigator>
        <UserUpdater />
      </>
    );

  return <SplashScreen />;
});

export default Navigation;
