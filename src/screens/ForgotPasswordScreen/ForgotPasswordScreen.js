import { API_URL } from "@env";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useState } from "react";
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
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../../assets/images/icon.png";

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  const [email, setEmail] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const BASE = API_URL?.endsWith("/") ? API_URL : `${API_URL}/`;

  const forgotPasswordPresed = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    setIsDisabled(true);

    const formBody = new URLSearchParams({ email }).toString();

    try {
      const { data } = await axios.post(
        `${BASE}api/auth/forgot-password`,
        formBody,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );

      if (data?.success === true) {
        Alert.alert(
          "Done",
          data?.message ||
            "If your E-Mail is registered, you will receive a reset link."
        );
        setEmail("");
        setTimeout(() => navigation.navigate("SignIn"), 2000);
      } else if (data?.oauth_account === "google") {
        Alert.alert("Sign in with Google", data.message, [
          { text: "OK", onPress: () => navigation.navigate("SignIn") },
        ]);
      } else if (data?.oauth_account === "apple") {
        Alert.alert("Sign in with Apple", data.message, [
          { text: "OK", onPress: () => navigation.navigate("SignIn") },
        ]);
      } else {
        Alert.alert(
          "Error",
          data?.message ||
            "An error occurred while sending the reset link. Please try again."
        );
      }
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      const status = error.response?.status;
      console.log("forgotPassword error:", status ? `[${status}] ${msg}` : msg);
      Alert.alert("Error", msg || "Something went wrong");
    } finally {
      setIsDisabled(false);
    }
  };

  const onGoBackPressed = () => {
    navigation.navigate("SignIn");
  };

  const logoHeight = Math.min(height * 0.18, 130);

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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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

              <Text style={styles.heroTitle}>Forgot your password?</Text>
              <Text style={styles.heroSubtitle}>
                No problem. Enter your email and we’ll help you get back into
                your account.
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardGlow} />
              <View style={styles.cardGlowSecondary} />

              <Text style={styles.title}>Reset your password</Text>
              <Text style={styles.subtitle}>
                Enter your registered email and we'll send you a reset link.
              </Text>

              <View style={styles.separator}>
                <View style={styles.line} />
                <View style={styles.separatorDot} />
                <View style={styles.line} />
              </View>

              <View style={styles.formContainer}>
                <Text style={styles.label}>Email</Text>

                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  placeholderTextColor="#8b7a69"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.input}
                />

                <TouchableOpacity
                  activeOpacity={0.9}
                  disabled={isDisabled}
                  onPress={forgotPasswordPresed}
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
                    Continue
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={onGoBackPressed}
                  style={styles.secondaryButton}
                >
                  <Text style={styles.secondaryButtonText}>Go Back</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footerHint}>
                <Text style={styles.footerHintText}>
                  Secure password recovery for your account
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 18 },
  shadowOpacity: 0.22,
  shadowRadius: 26,
  elevation: 14,
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#4b2815",
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#66371c",
  },

  bgOrbTop: {
    position: "absolute",
    top: -110,
    right: -50,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: "rgba(245, 166, 35, 0.16)",
  },

  bgOrbMiddle: {
    position: "absolute",
    top: "28%",
    left: -90,
    width: 240,
    height: 240,
    borderRadius: 240,
    backgroundColor: "rgba(138, 75, 39, 0.22)",
  },

  bgOrbBottom: {
    position: "absolute",
    bottom: -130,
    right: -30,
    width: 290,
    height: 290,
    borderRadius: 290,
    backgroundColor: "rgba(255, 239, 228, 0.06)",
  },

  bgOrbSoft: {
    position: "absolute",
    top: "58%",
    right: "12%",
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: "rgba(255, 194, 122, 0.07)",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },

  wrapper: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 26,
    justifyContent: "center",
    minHeight: "100%",
  },

  heroBlock: {
    width: "100%",
    maxWidth: 560,
    alignItems: "center",
    marginBottom: 20,
  },

  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },

  badgeText: {
    color: "#ffd18a",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },

  logo: {
    width: 180,
    maxWidth: 220,
    marginBottom: 18,
  },

  heroTitle: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
    color: "#fff7ea",
    textAlign: "center",
    letterSpacing: -0.9,
    marginBottom: 10,
  },

  heroSubtitle: {
    fontSize: 15,
    lineHeight: 24,
    color: "rgba(255, 240, 220, 0.88)",
    textAlign: "center",
    maxWidth: 470,
  },

  card: {
    width: "100%",
    maxWidth: 560,
    backgroundColor: "#f7efe4",
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: "rgba(236, 217, 191, 0.98)",
    overflow: "hidden",
    ...SHADOW,
  },

  cardGlow: {
    position: "absolute",
    top: -45,
    right: -20,
    width: 155,
    height: 155,
    borderRadius: 155,
    backgroundColor: "rgba(245, 166, 35, 0.11)",
  },

  cardGlowSecondary: {
    position: "absolute",
    bottom: -65,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 140,
    backgroundColor: "rgba(102, 55, 28, 0.05)",
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#24160b",
    textAlign: "center",
    marginTop: 4,
    marginBottom: 8,
    letterSpacing: -0.55,
  },

  subtitle: {
    fontSize: 14,
    color: "#6f6255",
    marginBottom: 12,
    lineHeight: 22,
    textAlign: "center",
  },

  separator: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#decab3",
  },

  separatorDot: {
    width: 9,
    height: 9,
    borderRadius: 9,
    backgroundColor: "#f5a623",
    marginHorizontal: 12,
  },

  formContainer: {
    width: "100%",
  },

  label: {
    fontSize: 13,
    color: "#7a614e",
    marginBottom: 8,
    fontWeight: "800",
  },

  input: {
    width: "100%",
    height: 58,
    borderRadius: 18,
    backgroundColor: "#fffaf5",
    borderWidth: 1,
    borderColor: "rgba(190, 160, 130, 0.35)",
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#24160b",
  },

  primaryButton: {
    width: "100%",
    marginTop: 16,
    backgroundColor: "#f5a623",
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  primaryButtonDisabled: {
    backgroundColor: "#d9b56a",
  },

  primaryButtonText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#2a1a11",
  },

  primaryButtonTextDisabled: {
    color: "#5b4632",
  },

  secondaryButton: {
    width: "100%",
    marginTop: 10,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(200, 116, 0, 0.22)",
    backgroundColor: "rgba(255,255,255,0.45)",
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#c87400",
  },

  footerHint: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(222, 202, 179, 0.95)",
    alignItems: "center",
  },

  footerHintText: {
    fontSize: 12,
    color: "#8b7a69",
    textAlign: "center",
    fontWeight: "500",
  },
});