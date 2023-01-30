import 'text-encoding';

import { decode, encode } from 'base-64';
import { polyfillWebCrypto } from 'expo-standard-web-crypto';
import React from 'react';
import Application from './src/index';

polyfillWebCrypto();
if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

const App = () => {
  return <Application />;
};

export default App;
