import { GOOGLE_CLIENT_ID_IOS, GOOGLE_CLIENT_ID_WEB } from "@env";
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { StatusBar, View } from "react-native";
import Root from "./src/Root";

// Importar GoogleSignin de forma condicional
let GoogleSignin;
try {
  GoogleSignin = require('@react-native-google-signin/google-signin').GoogleSignin;
} catch (error) {
  console.warn('GoogleSignin no está disponible (probablemente estás usando Expo Go)');
  GoogleSignin = null;
}

Notifications.addNotificationReceivedListener(notification => {
  console.log("Notification received in foreground:", notification);
});

Notifications.addNotificationResponseReceivedListener(response => {
  console.log("User interacted with notification:", response);
});

// Configurar notificaciones para mostrarse siempre, incluso si la app está abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {

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
