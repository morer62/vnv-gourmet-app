// eslint-disable-next-line import/no-unresolved
import { APP_VERSION } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';

// local imports
import { CustonButton } from './components/CustonButton/CustonButton';
import { UserProvider } from './context/userContext'; // ✅ Importa el Provider correctamente
import getAppVersion from './http/getAppVersion';
import Navigation from './navigation';
import sleep from './utils/sleep';

const DownloadLink = {
  android: 'https://play.google.com/store/apps/details?id=com.jonathanmoreno85.RVMobile',
  ios: 'https://apps.apple.com/us/app/the-rv-advisor/id6469863574'
};



export default function Root() {
  const [Loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [needAppUpdate, setNeedAppUpdate] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      await sleep(1);
      const token = await AsyncStorage.getItem('Token');
      const appVersionName = await getAppVersion();

      if (!isMounted) {
        return;
      }

      console.log('🔥 App version Endpoint:', appVersionName);
      console.log('🔥 App version Local:', APP_VERSION);
      setNeedAppUpdate(appVersionName !== APP_VERSION);
      setIsLogged(token != null);
      setLoading(false);
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  if (Loading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (needAppUpdate) {
    return (
      <View style={styles.container}>
        <Text style={[styles.title, { textAlign: 'center' }]}>
          A new version is available and needs to be updated
        </Text>
        <CustonButton
          text="DOWNLOAD"
          onPress={() => Linking.openURL(DownloadLink[Platform.OS])}
          type="Tertiary"
        />
      </View>
    );
  }

  return (
    <UserProvider>
      <Navigation isLogged={isLogged} />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b60a4',
    margin: 10
  }
});
