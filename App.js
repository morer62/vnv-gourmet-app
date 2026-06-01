import Constants from 'expo-constants';
import { useEffect } from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Root from './src/Root';

/**
 * SDK 53+: remote Android push is not available in Expo Go.
 * Loading expo-notifications there triggers an error/snackbar. Dev builds are fine.
 */
function shouldSkipExpoNotifications() {
  return Platform.OS === 'android' && Constants.appOwnership === 'expo';
}

export default function App() {
  useEffect(() => {
    if (shouldSkipExpoNotifications()) {
      return;
    }

    const Notifications = require('expo-notifications');

    Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received in foreground:', notification);
    });

    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('User interacted with notification:', response);
    });

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }, []);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="#66371c" barStyle="dark-content" />
        <Root />
      </View>
    </SafeAreaProvider>
  );
}
