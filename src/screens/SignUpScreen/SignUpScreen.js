import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomInput from '../../components/CustomInput';
import { CustonButton } from '../../components/CustonButton/CustonButton';
import { useUserContext } from '../../context/userContext';
import AlertMain from '../../utils/AlertMain';

const ACCENT = '#f59e0b';
const ACCENT_DARK = '#d97706';
const BG_DARK = '#1f140e';
const CARD_BG = 'rgba(255, 248, 239, 0.98)';
const BORDER = 'rgba(236, 217, 191, 0.95)';
const TEXT_DARK = '#24160b';
const TEXT_MUTED = '#6f6255';

const SHADOW = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 16 },
  shadowOpacity: 0.16,
  shadowRadius: 24,
  elevation: 10,
};

const BASE = API_URL?.endsWith('/') ? API_URL : `${API_URL}/`;
const APP_SIGNUP_LEVEL = '5';

export const SignUpScreen = () => {
  const navigation = useNavigation();
  const { setUserData } = useUserContext();

  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+1');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [TypeButton, setTypeButton] = useState('Primary');

  const signupUrl = useMemo(() => {
    const base = API_URL?.endsWith('/') ? API_URL : `${API_URL || ''}/`;
    return `${base}api/auth/signup`;
  }, []);

  const notify = useCallback((message) => {
    try {
      AlertMain(message);
    } catch {
      Alert.alert('Notice', message);
    }
  }, []);

  const handleRegister = async () => {
    Keyboard.dismiss();

    if (!name || !lastname || !email || !password || !passwordConfirmation) {
      return notify('Please fill out all fields');
    }
    if (password !== passwordConfirmation) {
      return notify('Passwords do not match');
    }

    setIsDisabled(true);
    setTypeButton('Disabled');

    try {
      const formBody = new URLSearchParams({
        name,
        lastname,
        email,
        phone: phoneNumber,
        password,
        passwordConfirmation,
        level: APP_SIGNUP_LEVEL,
      }).toString();

      const { data } = await axios.post(signupUrl, formBody, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        timeout: 20000,
      });

      const success = !!data?.success;
      const token = data?.data?.token || data?.token;
      const user = data?.data?.user || data?.user;
      const message =
        data?.message ||
        (success ? 'Account created successfully.' : 'Signup failed');

      if (success) {
        if (token && user) {
          await AsyncStorage.setItem('Token', token);
          await AsyncStorage.setItem('UserData', JSON.stringify(user));
          setUserData(user);
          notify('Account created successfully.');
          setTimeout(() => {
            navigation.navigate('panelNavigator', { screen: 'Panel' });
          }, 250);
          return;
        }
        notify('Account created successfully. Please log in.');
        setTimeout(() => {
          navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
        }, 300);
      } else {
        notify(message);
      }
    } catch (error) {
      const serverMsg =
        error?.response?.data?.message || error?.message || 'Connection error';
      notify(serverMsg);
    } finally {
      setIsDisabled(false);
      setTypeButton('Primary');
    }
  };

  const goBack = () => navigation.navigate('SignIn');

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.background}>
        <View style={styles.bgOrbTop} />
        <View style={styles.bgOrbMiddle} />
        <View style={styles.bgOrbBottom} />
      </View>

      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroBlock}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>VNV Events</Text>
            </View>

            <Text style={styles.heroTitle}>Create your account</Text>
            <Text style={styles.heroSubtitle}>Create your customer account directly in the app.</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardGlow} />

            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.meta}>
              Account type: <Text style={styles.metaStrong}>Client</Text>
            </Text>

            <View style={styles.separator}>
              <View style={styles.line} />
              <View style={styles.separatorDot} />
              <View style={styles.line} />
            </View>

            <Text style={styles.orText}>Continue with your details</Text>

            <View style={styles.formRow}>
                <Text style={styles.label}>First name</Text>
                <View style={styles.inputWrap}>
                  <CustomInput
                    placeHolder="Name"
                    value={name}
                    onChange={setName}
                    inputStyle={styles.customInputLight}
                    placeholderTextColor="#8b7a69"
                    iconColor="#8b7a69"
                  />
                </View>
              </View>

            <View style={styles.formRow}>
                <Text style={styles.label}>Last name</Text>
                <View style={styles.inputWrap}>
                  <CustomInput
                    placeHolder="Last Name"
                    value={lastname}
                    onChange={setLastname}
                    inputStyle={styles.customInputLight}
                    placeholderTextColor="#8b7a69"
                    iconColor="#8b7a69"
                  />
                </View>
              </View>

            <View style={styles.formRow}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputWrap}>
                  <CustomInput
                    placeHolder="Email"
                    value={email}
                    onChange={setEmail}
                    inputStyle={styles.customInputLight}
                    placeholderTextColor="#8b7a69"
                    iconColor="#8b7a69"
                  />
                </View>
              </View>

            <View style={styles.formRow}>
                <Text style={styles.label}>Phone number</Text>
                <View style={styles.inputWrap}>
                  <CustomInput
                    placeHolder="Phone Number"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    inputStyle={styles.customInputLight}
                    placeholderTextColor="#8b7a69"
                    iconColor="#8b7a69"
                  />
                </View>
              </View>

            <View style={styles.formRow}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrap}>
                  <CustomInput
                    placeHolder="Password"
                    value={password}
                    onChange={setPassword}
                    isSecured
                    inputStyle={styles.customInputLight}
                    placeholderTextColor="#8b7a69"
                    iconColor="#8b7a69"
                  />
                </View>
              </View>

            <View style={styles.formRow}>
                <Text style={styles.label}>Confirm password</Text>
                <View style={styles.inputWrap}>
                  <CustomInput
                    placeHolder="Confirm Password"
                    value={passwordConfirmation}
                    onChange={setPasswordConfirmation}
                    isSecured
                    inputStyle={styles.customInputLight}
                    placeholderTextColor="#8b7a69"
                    iconColor="#8b7a69"
                  />
                </View>
              </View>

            <View style={styles.buttonGroup}>
                <CustonButton
                  text="Create Account"
                  onPress={handleRegister}
                  isDisabled={isDisabled}
                  type={TypeButton}
                />
              </View>

            <View style={styles.buttonGroupSecondary}>
                <CustonButton text="Back" onPress={goBack} type="Tertiary" />
              </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG_DARK,
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BG_DARK,
  },

  bgOrbTop: {
    position: 'absolute',
    top: -120,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
  },

  bgOrbMiddle: {
    position: 'absolute',
    top: '34%',
    left: -90,
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor: 'rgba(251, 146, 60, 0.10)',
  },

  bgOrbBottom: {
    position: 'absolute',
    bottom: -130,
    right: -30,
    width: 290,
    height: 290,
    borderRadius: 290,
    backgroundColor: 'rgba(255, 209, 138, 0.10)',
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroBlock: {
    width: '100%',
    maxWidth: 620,
    alignItems: 'center',
    marginBottom: 18,
  },

  badge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    marginBottom: 16,
  },

  badgeText: {
    color: '#ffd18a',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  heroTitle: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
    color: '#fff7ea',
    textAlign: 'center',
    letterSpacing: -0.8,
    marginBottom: 10,
  },

  heroSubtitle: {
    fontSize: 14,
    lineHeight: 23,
    color: 'rgba(255, 240, 220, 0.82)',
    textAlign: 'center',
    maxWidth: 480,
  },

  card: {
    width: '100%',
    maxWidth: 620,
    backgroundColor: CARD_BG,
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    ...SHADOW,
  },

  cardGlow: {
    position: 'absolute',
    top: -50,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 150,
    backgroundColor: 'rgba(245, 158, 11, 0.10)',
  },

  title: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800',
    color: TEXT_DARK,
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  subtitle: {
    textAlign: 'center',
    color: TEXT_MUTED,
    marginTop: 8,
    marginBottom: 18,
    fontSize: 14,
    lineHeight: 22,
  },

  meta: {
    textAlign: 'center',
    color: TEXT_MUTED,
    marginTop: 8,
    marginBottom: 16,
    fontSize: 14,
  },

  metaStrong: {
    fontWeight: '800',
    color: TEXT_DARK,
  },

  typeGrid: {
    gap: 14,
    marginBottom: 16,
  },

  typeCard: {
    backgroundColor: '#fffdf9',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.2,
    borderColor: '#eddcca',
    alignItems: 'center',
    ...SHADOW,
    elevation: 3,
  },

  typeCardSelected: {
    borderColor: ACCENT,
    backgroundColor: '#fff8ee',
  },

  typeEmojiWrap: {
    width: 64,
    height: 64,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff2db',
    marginBottom: 10,
  },

  typeEmojiWrapSelected: {
    backgroundColor: '#ffe7bf',
  },

  typeEmoji: {
    fontSize: 30,
  },

  typeTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: TEXT_DARK,
    textAlign: 'center',
  },

  typeDesc: {
    fontSize: 13,
    color: TEXT_MUTED,
    textAlign: 'center',
    marginTop: 5,
    lineHeight: 20,
  },

  typePill: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: '#fff7ea',
    borderWidth: 1,
    borderColor: '#ecd9bf',
  },

  typePillSelected: {
    backgroundColor: '#fff0d3',
    borderColor: '#f2c46f',
  },

  typePillText: {
    color: '#8b6b3f',
    fontWeight: '700',
    fontSize: 12,
  },

  typePillTextSelected: {
    color: ACCENT_DARK,
  },

  linkCentered: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    color: '#4b3d31',
  },

  link: {
    color: ACCENT_DARK,
    fontWeight: '800',
  },

  socialRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 2,
  },

  googleText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
  },

  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#ead8c3',
    borderWidth: 1.5,
    borderRadius: 14,
    height: 50,
    width: '50%',
  },

  googleButtonAndroid: {
    width: '100%',
  },

  separator: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 10,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ead9c2',
  },

  separatorDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: ACCENT,
    marginHorizontal: 12,
  },

  orText: {
    textAlign: 'center',
    color: TEXT_MUTED,
    fontSize: 13,
    marginBottom: 14,
    fontWeight: '600',
  },

  formRow: {
    width: '100%',
    marginBottom: 11,
  },

  label: {
    fontSize: 13,
    color: '#7a6a5a',
    marginBottom: 8,
    fontWeight: '700',
  },

  inputWrap: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },

  customInputLight: {
    backgroundColor: '#fffaf5',
    borderColor: 'rgba(190, 160, 130, 0.35)',
    color: '#24160b',
    borderRadius: 18,
    height: 58,
    paddingLeft: 16,
    paddingRight: 48,
  },

  buttonGroup: {
    width: '100%',
    marginTop: 8,
  },

  buttonGroupSecondary: {
    width: '100%',
    marginTop: 10,
  },
});