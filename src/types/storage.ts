import { ThemeMode } from './themeMode';
import { User } from './user';

export type StorageType = 'background' | 'user';

export type UserStorageType = {
  theme: ThemeMode;
  relays: string[];
  profile: User;
};
export type BackgroundStorageType = {
  lastMessageAt: number;
  connexionId: string;
};
