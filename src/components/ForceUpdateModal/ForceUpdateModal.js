import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import {
  BackHandler,
  Image,
  Linking,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STORE_IOS =
  'https://apps.apple.com/us/app/avomeal/id6761430840';
const STORE_ANDROID =
  'https://play.google.com/store/apps/details?id=com.vnvevents.avomeal';

const colors = {
  bg: '#0d1117',
  card: '#161b22',
  border: '#30363d',
  accent: '#10b981',
  accentDark: '#059669',
  text: '#ffffff',
  muted: '#9ca3af',
};

/**
 * @param {{ visible: boolean; currentVersion: string; requiredVersion: string }} props
 */
export default function ForceUpdateModal({ visible, currentVersion, requiredVersion }) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!visible) return undefined;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => sub.remove();
  }, [visible]);

  const openIos = () => Linking.openURL(STORE_IOS);
  const openAndroid = () => Linking.openURL(STORE_ANDROID);
  const primaryAction = Platform.OS === 'ios' ? openIos : openAndroid;
  const secondaryAction = Platform.OS === 'ios' ? openAndroid : openIos;
  const primaryLabel =
    Platform.OS === 'ios' ? 'Update on the App Store' : 'Update on Google Play';
  const secondaryLabel =
    Platform.OS === 'ios' ? 'Google Play (Android)' : 'App Store (iOS)';

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      presentationStyle="overFullScreen"
      onRequestClose={() => {}}
    >
      <View style={[styles.backdrop, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <View style={styles.card}>
          <View style={styles.logoWrap}>
            <Image
              source={require('../../../assets/images/mobile-app-icon.png')}
              style={styles.logo}
              resizeMode="cover"
            />
          </View>

          <Text style={styles.title}>Update required</Text>
          <Text style={styles.body}>
            A new version of Avomeal is available. Please install the latest update to continue
            using the app with the newest features and fixes.
          </Text>

          <View style={styles.versionPill}>
            <Ionicons name="information-circle-outline" size={18} color={colors.muted} />
            <Text style={styles.versionText}>
              Your version {currentVersion}
              {'  ·  '}
              Required {requiredVersion}
            </Text>
          </View>

          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
            onPress={primaryAction}
          >
            <Ionicons
              name={Platform.OS === 'ios' ? 'logo-apple' : 'logo-google-playstore'}
              size={22}
              color={colors.text}
            />
            <Text style={styles.primaryBtnText}>{primaryLabel}</Text>
          </Pressable>

          <Pressable style={styles.secondaryBtn} onPress={secondaryAction}>
            <Text style={styles.secondaryBtnText}>{secondaryLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.92)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  logoWrap: {
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: '#fff',
  },
  logo: {
    width: 88,
    height: 88,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.muted,
    textAlign: 'center',
    marginBottom: 18,
  },
  versionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.bg,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: colors.border,
  },
  versionText: {
    flex: 1,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    marginBottom: 12,
  },
  primaryBtnPressed: {
    backgroundColor: colors.accentDark,
  },
  primaryBtnText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '600',
  },
});
