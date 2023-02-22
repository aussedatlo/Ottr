import React from 'react';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, Provider } from 'react-native-paper';
import { MD3Colors, MD3Theme } from 'react-native-paper/lib/typescript/types';
import { useUserContext } from '../context/UserContext';

export type ThemeColors = {
  success: string;
  transparent: string;
  warning: string;
  reaction: string;
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
    tertiaryContainer: '#e0e0e0',
    primary: '#0288d1',
    secondary: '#db4534',
    tertiary: '#a1b2c3',
    success: '#26a65b',
    warning: '#db9934',
    transparent: '#00000000',
    reaction: '#f3b616',
  },
};

const darkTheme: Theme = {
  ...MD3DarkTheme,
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    background: '#202225',
    primaryContainer: '#2f3136',
    secondaryContainer: '#40444b',
    tertiaryContainer: '#5E646E',
    primary: '#3498db',
    onPrimary: '#ffffff',
    secondary: '#db4534',
    onSecondary: '#ffffff',
    tertiary: '#a1b2c3',
    success: '#26a65b',
    warning: '#db9934',
    error: '#db4534',
    transparent: '#00000000',
    reaction: '#f2b513',
    backdrop: '#10101060',
  },
};

type ThemeProviderProps = {
  children: React.ReactNode;
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const colorScheme = useColorScheme();
  const { themeMode } = useUserContext();

  const theme =
    (themeMode === 'system' && colorScheme === 'light') || themeMode === 'light'
      ? lightTheme
      : darkTheme;

  return <Provider theme={theme}>{children}</Provider>;
};

export default ThemeProvider;
