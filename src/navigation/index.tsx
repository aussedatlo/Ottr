import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { observer } from 'mobx-react';
import React from 'react';
import { useTheme } from 'react-native-paper';
import AppBar from '../components/AppBar';
import HomeScreen from '../screens/Home';
import IntroScreen from '../screens/Intro';
import SelectContactScreen from '../screens/SelectContact';
import SplashScreen from '../screens/Splash';
import TalkScreen from '../screens/Talk';
import { useStores } from '../store';
import SettingsNavigation from './SettingsNavigation';

export type RootStackParamList = {
  Home: undefined;
  Intro: undefined;
  SelectContact: undefined;
  SettingsNav: undefined;
  Talk: { pubkey: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = observer(() => {
  const { userStore } = useStores();
  const { colors } = useTheme();

  if (userStore.isLoaded)
    return (
      <>
        <Stack.Navigator
          initialRouteName={!userStore.key ? 'Intro' : 'Home'}
          screenOptions={{
            header: (props) =>
              props.route.name !== 'SettingsNav' ? (
                <AppBar {...props} />
              ) : (
                <></>
              ),
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SettingsNav" component={SettingsNavigation} />
          <Stack.Screen name="SelectContact" component={SelectContactScreen} />
          <Stack.Screen name="Talk" component={TalkScreen} />
        </Stack.Navigator>
      </>
    );

  return <SplashScreen />;
});

export default Navigation;
