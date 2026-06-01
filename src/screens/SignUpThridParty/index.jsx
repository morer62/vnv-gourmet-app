import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingOverlay from '../../components/LoadingOverlay';
import { API_ROUTES, getApiUrl } from '../../config/apiRoutes';
import { BUSINESS_CONFIG, withBusinessScope } from '../../config/businessConfig';
import { useUserContext } from '../../context/userContext';
import AlertMain from '../../utils/AlertMain';
import sleep from '../../utils/sleep';

export default function SignUpThridParty() {
  const [isAccountCreating, setIsAccountCreating] = useState(false);
  const route = useRoute();
  const { value, type } = route.params || {};
  const { setUserData } = useUserContext();
  const navigation = useNavigation();

  const handleUserAuth = useCallback(async (response) => {
    const { token, user } = response.data?.data || response.data || {};

    if (!token || !user) {
      AlertMain('Account created. Please sign in.');
      navigation.navigate('SignIn');
      return;
    }

    await AsyncStorage.setItem('Token', token);
    await AsyncStorage.setItem('UserData', JSON.stringify(user));
    setUserData(user);
    navigation.navigate('panelNavigator', { screen: 'Panel' });
  }, [navigation, setUserData]);

  const handleIosCreation = useCallback(async () => {
    const payload = withBusinessScope({
      identityToken: value.identityToken,
      accountType: 'client',
      level: '5',
    });

    return axios.post(getApiUrl(API_ROUTES.appleClientSignup), payload, {
      headers: { 'Content-Type': 'application/json' },
    });
  }, [value]);

  const handleGoogleCreation = useCallback(async () => {
    const payload = withBusinessScope({
      idToken: value,
      accountType: 'client',
      level: '5',
    });

    return axios.post(getApiUrl(API_ROUTES.googleClientSignup), payload, {
      headers: { 'Content-Type': 'application/json' },
    });
  }, [value]);

  const handleAccountCreation = useCallback(async () => {
    const timeStart = Date.now();
    let response = null;

    try {
      setIsAccountCreating(true);

      switch (type) {
        case 'IOS':
          response = await handleIosCreation();
          break;
        case 'GOOGLE':
          response = await handleGoogleCreation();
          break;
        default:
          throw new Error('Provider not found');
      }
    } catch (error) {
      console.log(error.response?.data || error.message);
      AlertMain('There was an error while signing up. Please try later.');
      return;
    } finally {
      const elapsed = Date.now() - timeStart;
      const remaining = 2000 - elapsed;

      if (remaining > 0) {
        await sleep(3);
      }

      setIsAccountCreating(false);
    }

    await handleUserAuth(response);
  }, [type, handleUserAuth, handleGoogleCreation, handleIosCreation]);

  if (!value || !type) {
    return <></>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>
          Create your {BUSINESS_CONFIG.brandName} customer account.
        </Text>

        <View style={styles.typeGrid}>
          <TouchableOpacity
            onPress={handleAccountCreation}
            activeOpacity={0.9}
            style={styles.typeCard}
          >
            <Text style={styles.typeBadge}>{BUSINESS_CONFIG.brandName}</Text>
            <Text style={styles.typeTitle}>Customer Account</Text>
            <Text style={styles.typeDesc}>
              Order meals, review purchases, and manage your subscription.
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.linkCentered} onPress={() => navigation.navigate('SignIn')}>
          Already have an account? <Text style={styles.link}>Back to Sign in</Text>
        </Text>
      </View>

      <LoadingOverlay visible={isAccountCreating} />
    </SafeAreaView>
  );
}

const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.08,
  shadowRadius: 18,
  elevation: 8,
};

const ACCENT = '#f59e0b';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#66371c',
  },
  card: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#f7efe4',
    borderRadius: 16,
    padding: 20,
    ...SHADOW,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#24160b',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    textAlign: 'center',
    color: '#6f6255',
    marginBottom: 14,
  },
  typeGrid: {
    gap: 12,
    marginBottom: 12,
  },
  typeCard: {
    backgroundColor: '#fffaf5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ead8c3',
    alignItems: 'center',
    ...SHADOW,
    elevation: 2,
  },
  typeBadge: {
    color: ACCENT,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#24160b',
  },
  typeDesc: {
    fontSize: 13,
    color: '#6f6255',
    textAlign: 'center',
    marginTop: 4,
  },
  linkCentered: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    color: '#374151',
  },
  link: {
    color: ACCENT,
    fontWeight: '700',
  },
});
