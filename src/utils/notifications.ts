import * as Notifications from 'expo-notifications';
import { NotificationContentInput } from 'expo-notifications';

const OTTR_NOTIFICATION_IDENTIFIER = 'ottr-notifications';

export const initNotificationsAsync = async () => {
  await Notifications.getPermissionsAsync();
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
};

export const schedulePushNotificationAsync = async (
  content: NotificationContentInput,
) => {
  await Notifications.scheduleNotificationAsync({
    identifier: OTTR_NOTIFICATION_IDENTIFIER,
    content,
    trigger: { seconds: 1 },
  });
};
