import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Theme } from '../providers/ThemeProvider';
import KeyScreen from '../screens/Key';
import ProfileScreen from '../screens/Profile';
import RelaysScreen from '../screens/Relays';
import SettingsScreen from '../screens/Settings';

export type SettingsStackParamList = {
  Settings: undefined;
  Profile: undefined;
  Key: undefined;
  Relays: undefined;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

const SettingsNavigator = () => {
  const { colors, dark } = useTheme<Theme>();

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName={'Settings'}
        screenOptions={{
          statusBarColor: colors.background,
          statusBarStyle: dark ? 'light' : 'dark',
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.onBackground,
          animationTypeForReplace: 'push',
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
          }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Key" component={KeyScreen} />
        <Stack.Screen name="Relays" component={RelaysScreen} />
      </Stack.Navigator>
    </View>
  );
};

export default SettingsNavigator;
