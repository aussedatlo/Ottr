import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Observer } from "mobx-react";
import AppBar from "../components/AppBar";
import HomeScreen from "../screens/Home";
import IntroScreen from "../screens/Intro";
import PostScreen from "../screens/Post";
import ProfileScreen from "../screens/Profile";
import SettingsScreen from "../screens/Settings";
import SplashScreen from "../screens/Splash";
import { useStores } from "../store";

export type RootStackParamList = {
  Home: undefined;
  Intro: undefined;
  Post: undefined;
  Profile: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const { userStore } = useStores();
  const { colors } = useTheme();

  return (
    <Observer>
      {() => {
        if (userStore.isLoaded)
          return (
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
            </Stack.Navigator>
          );
        return <SplashScreen />;
      }}
    </Observer>
  );
};

export default Navigation;
