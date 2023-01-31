import 'text-encoding';

import { decode, encode } from 'base-64';
import React from 'react';
import Application from './src/index';

if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

const App = () => {
  return <Application />;
};

export default App;
