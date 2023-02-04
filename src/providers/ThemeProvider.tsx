import { observer } from 'mobx-react';
import React from 'react';
import { useColorScheme } from 'react-native';
import { MD3LightTheme, MD3DarkTheme, Provider } from 'react-native-paper';
import { MD3Colors, MD3Theme } from 'react-native-paper/lib/typescript/types';
import { useStores } from '../store';

export type ThemeColors = {
  success: string;
  transparent: string;
} & MD3Colors;

export type Theme = {
  colors: ThemeColors;
} & Omit<MD3Theme, 'colors'>;

const lightTheme: Theme = {
  ...MD3LightTheme,
  roundness: 2,
  colors: {
    ...MD3LightTheme.colors,
    background: '#f3f3f3',
    primaryContainer: '#ffffff',
    secondaryContainer: '#ececec',
    tertiaryContainer: '#ececec',
    primary: '#0288d1',
    secondary: '#2c2c2c',
    tertiary: '#a1b2c3',
    success: '#26a65b',
    transparent: '#00000000',
  },
};

const darkTheme: Theme = {
  ...MD3DarkTheme,
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    background: '#202225',
    primaryContainer: '#2f3136',
    secondaryContainer: '#36393f',
    tertiaryContainer: '#40444b',
    primary: '#3498db',
    onPrimary: '#ffffff',
    secondary: '#6dcae8',
    tertiary: '#a1b2c3',
    success: '#26a65b',
    transparent: '#00000000',
  },
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeProvider = observer(({ children }: ThemeProviderProps) => {
  const colorScheme = useColorScheme();
  const { userStore } = useStores();

  const theme =
    (userStore.themeMode === 'system' && colorScheme === 'light') ||
    userStore.themeMode === 'light'
      ? lightTheme
      : darkTheme;

  return <Provider theme={theme}>{children}</Provider>;
});

export default ThemeProvider;
