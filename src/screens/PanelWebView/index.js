import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';

import BottomContainer from '../../Layouts/Panel/BottomAction/BottonContainer';
import getUUID from '../../utils/uuid';

function PanelWebView() {
  const { params } = useRoute();
  const url = params?.url ?? '';

  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);

  const OPEN_URL = useMemo(() => {
    return `${API_URL}Panel/Tokenapi/${token}/${url}`;
  }, [token, url]);

  useEffect(() => {
    async function load() {
      const storedToken = await AsyncStorage.getItem('Token');
      if (storedToken) {
        setToken(storedToken);
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading || !token || !url) {
    return (
      <BottomContainer>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1b60a4" />
        </View>
      </BottomContainer>
    );
  }

  return (
    <BottomContainer>
      <View style={{ flex: 1 }}>
        <WebView
          key={getUUID()}
          cacheEnabled={false}
          cacheMode="LOAD_NO_CACHE"
          source={{ uri: OPEN_URL }}
          style={{ flex: 1 }}
          startInLoadingState
        />
      </View>
    </BottomContainer>
  );
}

export default PanelWebView;
