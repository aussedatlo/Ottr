import {
  DefaultTheme,
  NavigationContainer,
  useNavigation,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { observer } from 'mobx-react';
import { useNostr } from 'nostr-react';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../providers/ThemeProvider';
import HomeScreen from '../screens/Home';
import IntroScreen from '../screens/Intro';
import SelectContactScreen from '../screens/SelectContact';
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

const HeaderRight = () => {
  const { connectedRelays } = useNostr();
  const { userStore } = useStores();
  const { colors } = useTheme<Theme>();
  const { navigate } =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <>
      <IconButton icon="cog" onPress={() => navigate('SettingsNav')} />
      <IconButton
        icon="checkbox-multiple-marked-circle"
        iconColor={
          connectedRelays.length === userStore.relays.length
            ? colors.success
            : colors.error
        }
      />
    </>
  );
};

const Navigation = observer(() => {
  const { userStore } = useStores();
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const navigationTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: theme.colors.background,
      },
    }),
    [theme],
  );

  return (
    <SafeAreaView style={styles.root}>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          initialRouteName={!userStore.key ? 'Intro' : 'Home'}
          screenOptions={{
            statusBarColor: theme.colors.background,
            statusBarStyle: theme.dark ? 'light' : 'dark',
            headerStyle: { backgroundColor: theme.colors.background },
            headerTintColor: theme.colors.onBackground,
            animationTypeForReplace: 'pop',
            animation: 'fade',
          }}
        >
          <Stack.Screen
            name="Intro"
            component={IntroScreen}
            options={{ title: '', header: () => <></> }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Ottr',
              headerRight: HeaderRight,
            }}
          />
          <Stack.Screen
            name="SettingsNav"
            component={SettingsNavigation}
            options={{
              title: 'Settings',
              header: () => <></>,
            }}
          />
          <Stack.Screen
            name="SelectContact"
            component={SelectContactScreen}
            options={{ title: 'Select Contact', headerRight: HeaderRight }}
          />
          <Stack.Screen
            name="Talk"
            component={TalkScreen}
            options={{
              animationTypeForReplace: 'push',
              animation: 'fade_from_bottom',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
});

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
  });
};

export default Navigation;
