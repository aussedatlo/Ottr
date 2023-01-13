import "text-encoding";

import React from "react";
import Application from "./src/index";
import { polyfillWebCrypto } from "expo-standard-web-crypto";
import { decode, encode } from "base-64";

polyfillWebCrypto();
if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

const App = () => {
  return <Application />;
};

export default App;
