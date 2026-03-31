import './config/axiosConfig';

// eslint-disable-next-line import/no-unresolved
import { APP_VERSION } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

// local imports
import IntroVideo from './components/IntroVideo/IntroVideo';
import { UserProvider } from './context/userContext';
import getAppVersion from './http/getAppVersion';
import Navigation from './navigation';

const INTRO_DURATION_MS = 5000;

export default function Root() {
  const [loading, setLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [needAppUpdate, setNeedAppUpdate] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  const introHiddenRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let introTimer = null;

    const hideIntro = () => {
      if (!isMounted || introHiddenRef.current) return;
      introHiddenRef.current = true;
      setShowIntro(false);
    };

    async function load() {
      try {
        introTimer = setTimeout(() => {
          hideIntro();
        }, INTRO_DURATION_MS);

        const [token, appVersionName] = await Promise.all([
          AsyncStorage.getItem('Token'),
          getAppVersion(),
        ]);

        if (!isMounted) return;

        console.log('🔥 App version Endpoint:', appVersionName);
        console.log('🔥 App version Local:', APP_VERSION);

        setNeedAppUpdate(appVersionName !== APP_VERSION);
        setIsLogged(token != null);
      } catch (error) {
        console.log('Root load error:', error?.message || error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
      if (introTimer) {
        clearTimeout(introTimer);
      }
    };
  }, []);

  if (showIntro) {
    return (
      <IntroVideo
        onFinish={() => {
          if (!introHiddenRef.current) {
            introHiddenRef.current = true;
            setShowIntro(false);
          }
        }}
      />
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#f5a623" />
      </View>
    );
  }

  /*
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
  */

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
    backgroundColor: '#ecf0f1',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b60a4',
    margin: 10,
  },
});