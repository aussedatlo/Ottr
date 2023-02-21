import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { hideAsync } from 'expo-splash-screen';
import React, { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import GenericModal from '../components/Modal/GenericModal';
import { useDatabaseContext } from '../context/DatabaseContext';
import { useUserContext } from '../context/UserContext';
import { Theme } from '../providers/ThemeProvider';
import HomeScreen from '../screens/Home';
import IntroScreen from '../screens/Intro';
import SelectContactScreen from '../screens/SelectContact';
import TalkScreen from '../screens/Talk';
import HeaderRight from './HeaderRight';
import SettingsNavigation from './SettingsNavigation';

export type RootStackParamList = {
  Home: undefined;
  Intro: undefined;
  SelectContact: undefined;
  SettingsNav: undefined;
  Talk: { pubkey: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigation = () => {
  const theme = useTheme<Theme>();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { pubkey, isLoaded: userContextLoaded } = useUserContext();
  const { isLoaded: databaseContextLoaded } = useDatabaseContext();

  const isLoaded = userContextLoaded && databaseContextLoaded;

  const onLayout = useCallback(() => {
    if (isLoaded) hideAsync().catch(console.error);
  }, [isLoaded]);

  const navigationTheme = useMemo(
    () => ({
      ...DefaultTheme,
      colors: {
        ...DefaultTheme.colors,
        background: theme.colors.primaryContainer,
      },
    }),
    [theme],
  );

  if (!isLoaded) return <></>;

  return (
    <SafeAreaView style={styles.root} onLayout={onLayout}>
      <NavigationContainer theme={navigationTheme}>
        {!pubkey ? (
          <Stack.Navigator
            initialRouteName={'Intro'}
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
          </Stack.Navigator>
        ) : (
          <Stack.Navigator
            initialRouteName={'Home'}
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
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Ottr',
                headerRight: () => <HeaderRight />,
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
        )}
        <GenericModal />
      </NavigationContainer>
    </SafeAreaView>
  );
};

const createStyles = ({ colors }: Theme) => {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
  });
};

export default Navigation;
