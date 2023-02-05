import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Ottr',
  slug: 'Ottr',
  version: '1.0.0',
  jsEngine: 'hermes',
  platforms: ['android', 'ios'],
  extra: { eas: { projectId: '135f5956-8d65-4ae1-906f-1761c5d70bc9' } },
  icon: './assets/icon.png',
  splash: { image: './assets/splash-screen.png', resizeMode: 'contain' },
  assetBundlePatterns: ['**/*'],
  userInterfaceStyle: 'automatic',
  android: {
    package: 'com.laiin.Ottr',
    adaptiveIcon: { foregroundImage: './assets/adaptative-icon.png' },
  },
  ios: {
    bundleIdentifier: 'com.laiin.Ottr',
  },
};

export default config;
