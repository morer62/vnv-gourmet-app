import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

import { BUSINESS_CONFIG } from '../../config/businessConfig';
import { buildTokenWebViewUrl } from '../../config/apiRoutes';
import BottomContainer from '../../Layouts/Panel/BottomAction/BottonContainer';
import getUUID from '../../utils/uuid';

function PanelWebView() {
  const { params } = useRoute();
  const navigation = useNavigation();
  const url = params?.url ?? '';

  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [webViewKey, setWebViewKey] = useState(getUUID());

  const OPEN_URL = useMemo(() => {
    return buildTokenWebViewUrl(token, url);
  }, [token, url]);

  const returnToLogin = useCallback(async () => {
    await AsyncStorage.multiRemove(['Token', 'UserData']);
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'loginNavigator',
          state: { routes: [{ name: 'SignIn' }] },
        },
      ],
    });
  }, [navigation]);

  useEffect(() => {
    async function load() {
      try {
        const storedToken = await AsyncStorage.getItem('Token');
        if (storedToken) {
          setToken(storedToken);
          setErrorMessage('');
        } else {
          setErrorMessage('Your session is missing. Please sign in again.');
        }
      } catch {
        setErrorMessage('Could not restore your session. Please sign in again.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleNavigationStateChange = useCallback((navState) => {
    const nextUrl = navState?.url || '';
    const lowerUrl = nextUrl.toLowerCase();

    if (
      nextUrl &&
      nextUrl.startsWith(BUSINESS_CONFIG.webBaseUrl) &&
      (lowerUrl.includes('/login') || lowerUrl.includes('auth/login'))
    ) {
      setErrorMessage('Your session expired. Please sign in again.');
    }
  }, []);

  const retryWebView = useCallback(() => {
    setErrorMessage('');
    setWebViewKey(getUUID());
  }, []);

  if (loading) {
    return (
      <BottomContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#f5a623" />
        </View>
      </BottomContainer>
    );
  }

  if (!token || !url || errorMessage) {
    return (
      <BottomContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#66371c' }}>
          <Text style={{ color: '#fff7ea', fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 10 }}>
            Web page unavailable
          </Text>
          <Text style={{ color: '#f3dfbf', fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 18 }}>
            {errorMessage || 'This route is not available right now.'}
          </Text>
          {token && url ? (
            <TouchableOpacity onPress={retryWebView} style={{ backgroundColor: '#f5a623', borderRadius: 999, paddingHorizontal: 20, paddingVertical: 12, marginBottom: 10 }}>
              <Text style={{ color: '#2a1a11', fontWeight: '900' }}>Try Again</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={returnToLogin} style={{ paddingHorizontal: 20, paddingVertical: 12 }}>
            <Text style={{ color: '#fff7ea', fontWeight: '800' }}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </BottomContainer>
    );
  }

  return (
    <BottomContainer>
      <View style={{ flex: 1 }}>
        <WebView
          key={webViewKey}
          cacheEnabled={false}
          cacheMode="LOAD_NO_CACHE"
          geolocationEnabled
          allowsInlineMediaPlayback
          source={{ uri: OPEN_URL }}
          style={{ flex: 1 }}
          startInLoadingState
          onNavigationStateChange={handleNavigationStateChange}
          onError={(event) => {
            const description = event.nativeEvent?.description || 'The page could not be loaded.';
            setErrorMessage(description);
          }}
          onHttpError={(event) => {
            const statusCode = event.nativeEvent?.statusCode;
            if (statusCode === 401 || statusCode === 403) {
              setErrorMessage('Your session expired or this account cannot open that page.');
              return;
            }
            if (statusCode === 404) {
              setErrorMessage('This Avomeal page does not exist yet.');
              return;
            }
            if (statusCode >= 500) {
              setErrorMessage('The Avomeal server returned an error. Please try again later.');
            }
          }}
        />
      </View>
    </BottomContainer>
  );
}

export default PanelWebView;
