import 'text-encoding';

import { decode, encode } from 'base-64';
import React from 'react';
import Application from './src/index';

import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(console.error);

if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

const App = () => {
  return <Application />;
};

export default App;
