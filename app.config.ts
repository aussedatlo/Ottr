import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'Ottr',
  slug: 'Ottr',
  version: '1.0.0',
  jsEngine: 'hermes',
  platforms: ['android'],
  extra: { eas: { projectId: '135f5956-8d65-4ae1-906f-1761c5d70bc9' } },
  icon: './assets/icon.png',
  splash: { image: './assets/splash-screen.png', resizeMode: 'contain' },
  assetBundlePatterns: ['**/*'],
  userInterfaceStyle: 'automatic',
  android: {
    package: 'laiin.ottr.com',
    adaptiveIcon: { foregroundImage: './assets/adaptative-icon.png' },
    splash: {
      image: './assets/splash-screen.png',
    },
  },
};

export default config;
