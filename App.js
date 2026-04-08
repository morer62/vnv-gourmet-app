import { GOOGLE_CLIENT_ID_IOS, GOOGLE_CLIENT_ID_WEB } from "@env";
import Constants from 'expo-constants';
import { useEffect } from 'react';
import { Platform, StatusBar, View } from "react-native";
import Root from "./src/Root";

// Importar GoogleSignin de forma condicional
let GoogleSignin;
try {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
} catch (error) {
  console.warn('GoogleSignin no está disponible (probablemente estás usando Expo Go)');
  GoogleSignin = null;
}

/**
 * SDK 53+: push remoto en Android fue removido de Expo Go.
 * Cargar expo-notifications ahí dispara error / snackbar. En dev build sí aplica.
 * @see https://docs.expo.dev/develop/development-builds/introduction/
 */
function shouldSkipExpoNotifications() {
  return Platform.OS === 'android' && Constants.appOwnership === 'expo';
}

export default function App() {

  useEffect(() => {
    if (shouldSkipExpoNotifications()) {
      return;
    }
    // require aquí evita que el módulo (y su auto-registro) cargue en Expo Go Android
    const Notifications = require('expo-notifications');

    Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received in foreground:", notification);
    });

    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("User interacted with notification:", response);
    });

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }, []);

  useEffect(() => {
    if (GoogleSignin) {
      GoogleSignin.configure({
        iosClientId: GOOGLE_CLIENT_ID_IOS,
        webClientId: GOOGLE_CLIENT_ID_WEB
      })
    }
  }, [])
  return (
    <View style={{ flex: 1 }}>
      <StatusBar 
        backgroundColor="#6200EE"
        barStyle="dark-content" 
      />
      <Root />
    </View>
  );
}
