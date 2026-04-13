// eslint-disable-next-line import/no-unresolved
const API_URL = process.env.API_URL;
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import Logo from '../../../assets/images/icon_login.png';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useUserContext } from '../../context/userContext';
import AlertMain from '../../utils/AlertMain';

// Importar GoogleSignin de forma condicional
let GoogleSignin, isSuccessResponse;
try {
  const googleSignInModule = require('@react-native-google-signin/google-signin');
  GoogleSignin = googleSignInModule.GoogleSignin;
  isSuccessResponse = googleSignInModule.isSuccessResponse;
} catch (error) {
  console.warn('GoogleSignin no está disponible (probablemente estás usando Expo Go)');
  GoogleSignin = null;
  isSuccessResponse = null;
}

export const SignInScreen = () => {
  const { height, width } = useWindowDimensions();
  const navigation = useNavigation();
  const { setUserData } = useUserContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isOnThirdPartySigninIn, setIsOnThridPartySignIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const BASE = API_URL?.trim()
  ? (API_URL.endsWith('/') ? API_URL : `${API_URL}/`)
  : '';
const loginUrl = `${BASE}api/auth/login`;

  const onSignInPressed = async () => {
    setIsDisabled(true);

    try {
      const formBody = new URLSearchParams({
        email,
        password,
        expo_token: '',
      }).toString();

      console.log('[LOGIN API_URL]', API_URL);
      console.log('[LOGIN BASE]', BASE);
      console.log('[LOGIN URL]', loginUrl);
      console.log('[LOGIN EMAIL]', email);

      const res = await axios.post(loginUrl, formBody, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 15000,
        validateStatus: () => true,
      });

      console.log('[LOGIN STATUS]', res?.status);
      console.log('[LOGIN RESPONSE]', res?.data);

      if (res.data?.success) {
        await AsyncStorage.setItem('Token', res.data.token);
        await AsyncStorage.setItem('UserData', JSON.stringify(res.data.user));
        setUserData(res.data.user);
        setTimeout(() => navigation.navigate('panelNavigator', { screen: 'Panel' }), 0);
      } else {
        AlertMain(res.data?.message || 'Login failed');
      }
    } catch (error) {
      console.log('[LOGIN ERROR message]', error?.message);
      console.log('[LOGIN ERROR code]', error?.code);
      console.log('[LOGIN ERROR status]', error?.response?.status);
      console.log('[LOGIN ERROR response]', error?.response?.data);
      console.log('[LOGIN ERROR API_URL]', API_URL);
      console.log('[LOGIN ERROR BASE]', BASE);
      console.log('[LOGIN ERROR URL]', loginUrl);

      AlertMain(`Connection error: ${error?.message || 'unknown error'}`);
    } finally {
      setIsDisabled(false);
    }
  };

  const handleGoogleBackendLogin = async (google_token) => {
    try {
      const res = await axios.post(
        loginUrl,
        new URLSearchParams({ google_token }).toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 15000,
          validateStatus: () => true,
        }
      );

      console.log('[GOOGLE LOGIN STATUS]', res?.status);
      console.log('[GOOGLE LOGIN RESPONSE]', res?.data);

      await handleUserPostAuthentication(res);
    } catch (error) {
      console.log('[GOOGLE LOGIN ERROR message]', error?.message);
      console.log('[GOOGLE LOGIN ERROR code]', error?.code);
      console.log('[GOOGLE LOGIN ERROR status]', error?.response?.status);
      console.log('[GOOGLE LOGIN ERROR response]', error?.response?.data);

      if (error.response?.status === 404) {
        onThridPartyNonAccount(google_token, 'GOOGLE');
        return;
      }

      if (error.response?.data?.message) {
        AlertMain(error.response.data.message);
        return;
      }

      AlertMain('Could not sign in with google');
    }
  };

  const handleIosToken = async (value) => {
    try {
      const payload = new URLSearchParams({
        apple_credentials: value.identityToken
      });

      const response = await axios.post(loginUrl, payload.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 15000,
        validateStatus: () => true,
      });

      console.log('[APPLE LOGIN STATUS]', response?.status);
      console.log('[APPLE LOGIN RESPONSE]', response?.data);

      await handleUserPostAuthentication(response);
    } catch (error) {
      console.log('[APPLE LOGIN ERROR message]', error?.message);
      console.log('[APPLE LOGIN ERROR code]', error?.code);
      console.log('[APPLE LOGIN ERROR status]', error?.response?.status);
      console.log('[APPLE LOGIN ERROR response]', error?.response?.data);

      if (error.response?.status === 404) {
        onThridPartyNonAccount(value, 'IOS');
        return;
      }

      if (error.response?.data?.message) {
        AlertMain(error.response.data.message);
        return;
      }

      AlertMain('Apple login error');
    }
  };

  const onThridPartyNonAccount = (value, type) => {
    Alert.alert('We could not find an existing account', 'Would you like to create one?', [
      {
        text: 'Cancel'
      },
      {
        text: 'Create',
        onPress: () => {
          navigation.navigate('SignUpThirdParty', {
            value,
            type
          });
        }
      }
    ]);
  };

  const handleUserPostAuthentication = async (response) => {
    if (response.data?.success) {
      await AsyncStorage.setItem('Token', response.data.token);
      await AsyncStorage.setItem('UserData', JSON.stringify(response.data.user));
      setUserData(response.data.user);
      navigation.navigate('panelNavigator', { screen: 'Panel' });
    } else {
      AlertMain(response.data?.message || 'login failed');
    }
  };

  const onGooglePress = async () => {
    if (!GoogleSignin) {
      AlertMain('Google Sign-in no está disponible. Por favor, usa un development build.');
      return;
    }

    try {
      setIsOnThridPartySignIn(true);

      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();

      const response = await GoogleSignin.signIn({
        prompt: 'select_account',
      });

      if (isSuccessResponse && isSuccessResponse(response)) {
        const { idToken } = response.data;
        await handleGoogleBackendLogin(idToken);
      }

      setIsOnThridPartySignIn(false);
    } catch (error) {
      console.log('[GOOGLE PRESS ERROR]', error?.message);
      setIsOnThridPartySignIn(false);
    }
  };

  let googleButtonStyles = styles.googleButton;

  if (Platform.OS === 'android') {
    googleButtonStyles = {
      ...styles.googleButton,
      ...styles.googleButtonAndroid,
    };
  }

  const logoHeight = Math.min(height * 0.18, 130);
  const isSmallDevice = width < 390;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.background}>
        <View style={styles.bgOrbTop} />
        <View style={styles.bgOrbMiddle} />
        <View style={styles.bgOrbBottom} />
        <View style={styles.bgOrbSoft} />
      </View>

      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.wrapper}>
            <View style={styles.heroBlock}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>VNV Events</Text>
              </View>

              <Image
                source={Logo}
                style={[styles.logo, { height: logoHeight }]}
                resizeMode="contain"
              />

              <Text style={[styles.heroTitle, isSmallDevice && styles.heroTitleSmall]}>
                Welcome back
              </Text>

              <Text style={styles.heroSubtitle}>
                Sign in to access your panel, orders, clients, and everything you need in one beautiful place.
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardGlow} />
              <View style={styles.cardGlowSecondary} />

              <Text style={styles.title}>Sign in to your account</Text>
              <Text style={styles.cardSubtitle}>
                Continue with your email and password.
              </Text>

              {/*
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10
                }}
              >
                <TouchableOpacity
                  style={googleButtonStyles}
                  onPress={onGooglePress}
                  activeOpacity={0.9}
                >
                  <Text style={styles.googleText}>Google</Text>
                </TouchableOpacity>
              </View>
              */}

              <View style={styles.separator}>
                <View style={styles.line} />
                <View style={styles.separatorDot} />
                <View style={styles.line} />
              </View>

              <View style={styles.formArea}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email"
                  placeholderTextColor="#8b7a69"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />

                <Text style={[styles.label, styles.labelSpacing]}>Password</Text>
                <View style={styles.passwordWrap}>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="#8b7a69"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={styles.passwordInput}
                  />

                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    style={styles.passwordToggle}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.passwordToggleText}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.actionsRow}>
                  <Text style={styles.rememberText}>Remember me</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  activeOpacity={0.9}
                  disabled={isDisabled}
                  onPress={onSignInPressed}
                  style={[
                    styles.primaryButton,
                    isDisabled && styles.primaryButtonDisabled,
                  ]}
                >
                  <Text
                    style={[
                      styles.primaryButtonText,
                      isDisabled && styles.primaryButtonTextDisabled,
                    ]}
                  >
                    Sign in
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('SignUp')}
                  style={styles.registerCta}
                >
                  <Text style={styles.registerTextMuted}>Don&apos;t have an account? </Text>
                  <Text style={styles.registerTextStrong}>Create account</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footerHint}>
                <Text style={styles.footerHintText}>
                  Secure access for your account and workspace
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <LoadingOverlay visible={isOnThirdPartySigninIn} />
    </SafeAreaView>
  );
};

const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 18 },
  shadowOpacity: 0.22,
  shadowRadius: 26,
  elevation: 14,
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#4b2815',
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#66371c',
  },

  bgOrbTop: {
    position: 'absolute',
    top: -110,
    right: -50,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: 'rgba(245, 166, 35, 0.16)',
  },

  bgOrbMiddle: {
    position: 'absolute',
    top: '26%',
    left: -90,
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor: 'rgba(138, 75, 39, 0.22)',
  },

  bgOrbBottom: {
    position: 'absolute',
    bottom: -130,
    right: -30,
    width: 290,
    height: 290,
    borderRadius: 290,
    backgroundColor: 'rgba(255, 239, 228, 0.06)',
  },

  bgOrbSoft: {
    position: 'absolute',
    top: '56%',
    right: '12%',
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: 'rgba(255, 194, 122, 0.07)',
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 26,
    minHeight: '100%',
  },

  heroBlock: {
    width: '100%',
    maxWidth: 560,
    alignItems: 'center',
    marginBottom: 20,
  },

  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },

  badgeText: {
    color: '#ffd18a',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },

  logo: {
    width: 180,
    maxWidth: 220,
    marginBottom: 18,
  },

  heroTitle: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '900',
    color: '#fff7ea',
    textAlign: 'center',
    letterSpacing: -0.9,
    marginBottom: 10,
  },

  heroTitleSmall: {
    fontSize: 31,
    lineHeight: 35,
  },

  heroSubtitle: {
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(255, 240, 220, 0.88)',
    textAlign: 'center',
    maxWidth: 470,
  },

  card: {
    width: '100%',
    maxWidth: 560,
    backgroundColor: '#f7efe4',
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(236, 217, 191, 0.98)',
    overflow: 'hidden',
    ...SHADOW,
  },

  cardGlow: {
    position: 'absolute',
    top: -45,
    right: -20,
    width: 155,
    height: 155,
    borderRadius: 155,
    backgroundColor: 'rgba(245, 166, 35, 0.11)',
  },

  cardGlowSecondary: {
    position: 'absolute',
    bottom: -65,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 140,
    backgroundColor: 'rgba(102, 55, 28, 0.05)',
  },

  title: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '900',
    color: '#24160b',
    textAlign: 'center',
    letterSpacing: -0.55,
  },

  cardSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: '#6f6255',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 6,
  },

  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fffaf5',
    borderColor: 'rgba(190, 160, 130, 0.35)',
    borderWidth: 1,
    borderRadius: 12,
    height: 50,
    width: '50%',
  },

  googleButtonAndroid: {
    width: '100%',
  },

  googleText: {
    fontSize: 15,
    color: '#24160b',
    fontWeight: '700',
  },

  separator: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#decab3',
  },

  separatorDot: {
    width: 9,
    height: 9,
    borderRadius: 9,
    backgroundColor: '#f5a623',
    marginHorizontal: 12,
  },

  formArea: {
    width: '100%',
  },

  label: {
    fontSize: 13,
    color: '#7a614e',
    marginBottom: 8,
    fontWeight: '800',
  },

  labelSpacing: {
    marginTop: 12,
  },

  input: {
    width: '100%',
    height: 58,
    borderRadius: 18,
    backgroundColor: '#fffaf5',
    borderWidth: 1,
    borderColor: 'rgba(190, 160, 130, 0.35)',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#24160b',
  },

  passwordWrap: {
    width: '100%',
    minHeight: 58,
    borderRadius: 18,
    backgroundColor: '#fffaf5',
    borderWidth: 1,
    borderColor: 'rgba(190, 160, 130, 0.35)',
    paddingLeft: 16,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  passwordInput: {
    flex: 1,
    height: 58,
    fontSize: 16,
    color: '#24160b',
    paddingRight: 10,
  },

  passwordToggle: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(245, 166, 35, 0.12)',
  },

  passwordToggleText: {
    color: '#8b5a22',
    fontSize: 12,
    fontWeight: '800',
  },

  actionsRow: {
    width: '100%',
    marginTop: 8,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rememberText: {
    fontSize: 12,
    color: '#8b7a69',
    fontWeight: '500',
  },

  forgotText: {
    fontSize: 12,
    color: '#c87400',
    fontWeight: '800',
  },

  primaryButton: {
    width: '100%',
    marginTop: 2,
    backgroundColor: '#f5a623',
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonDisabled: {
    backgroundColor: '#d9b56a',
  },

  primaryButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2a1a11',
  },

  primaryButtonTextDisabled: {
    color: '#5b4632',
  },

  registerCta: {
    marginTop: 14,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
  },

  registerTextMuted: {
    color: '#7f6a55',
    fontSize: 13,
    fontWeight: '600',
  },

  registerTextStrong: {
    color: '#c87400',
    fontSize: 13,
    fontWeight: '900',
  },

  footerHint: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(222, 202, 179, 0.95)',
    alignItems: 'center',
  },

  footerHintText: {
    fontSize: 12,
    color: '#8b7a69',
    textAlign: 'center',
    fontWeight: '500',
  },
});