import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import axios from "axios";

import Icon1 from "../../../assets/images/icons_website/icon_1.png";
import Icon10 from "../../../assets/images/icons_website/icon_10.png";
import Icon11 from "../../../assets/images/icons_website/icon_11.png";
import Icon12 from "../../../assets/images/icons_website/icon_12.png";
import Icon13 from "../../../assets/images/icons_website/icon_13.png";
import Icon14 from "../../../assets/images/icons_website/icon_14.png";
import Icon15 from "../../../assets/images/icons_website/icon_15.png";
import Icon2 from "../../../assets/images/icons_website/icon_2.png";
import Icon3 from "../../../assets/images/icons_website/icon_3.png";
import Icon4 from "../../../assets/images/icons_website/icon_4.png";
import Icon5 from "../../../assets/images/icons_website/icon_5.png";
import Icon6 from "../../../assets/images/icons_website/icon_6.png";
import Icon7 from "../../../assets/images/icons_website/icon_7.png";
import Icon8 from "../../../assets/images/icons_website/icon_8.png";
import Icon9 from "../../../assets/images/icons_website/icon_9.png";

import LoadingOverlay from "../../components/LoadingOverlay";
import { WEBVIEW_ROUTES } from "../../config/apiRoutes";
import { BUSINESS_CONFIG } from "../../config/businessConfig";
import QuestionAlert from "../../components/QuestionAlert";
import { useUserContext } from "../../context/userContext";
import changeAccountType from "../../http/changeAccountType";
import BottomContainer from "../../Layouts/Panel/BottomAction/BottonContainer";
import AlertMain from "../../utils/AlertMain";
import sleep from "../../utils/sleep";
import getUUID from "../../utils/uuid";

const accountTypes = [
  { value: 5, label: "client account" },
];

const iconList = [
  Icon1,
  Icon2,
  Icon3,
  Icon4,
  Icon5,
  Icon6,
  Icon7,
  Icon8,
  Icon9,
  Icon10,
  Icon11,
  Icon12,
  Icon13,
  Icon14,
  Icon15,
];

function getIconByIndex(index) {
  const safeIndex = index % iconList.length;
  return iconList[safeIndex];
}

function getPanelConfig(level) {
  const ownerPrimary = [
    {
      label: "Store Orders",
      description: "Open Avomeal order operations in the backend workspace.",
      url: WEBVIEW_ROUTES.adminStoreOrders,
    },
    {
      label: "Products",
      description: "Manage catalog, categories and product details.",
      url: "panel/planner-hub/store/products/home",
    },
    {
      label: "People",
      description: "Access customers and team members.",
      url: "panel/planner-hub/management/users",
    },
  ];

  const ownerSecondary = [
    {
      label: "View Store",
      url: WEBVIEW_ROUTES.storeHome,
    },
    {
      label: "Chat",
      url: "panel/planner-hub/team/chat",
    },
    {
      label: "CRM",
      url: "panel/planner-hub/management/crm",
    },
    {
      label: "Settings",
      url: "panel/settings",
    },
  ];

  const teamPrimary = [
    {
      label: "Store Orders",
      description: "Review assigned Avomeal preparation and delivery work.",
      url: WEBVIEW_ROUTES.teamStoreOrders,
    },
    {
      label: "Track Time",
      description: "Clock in and out and keep work hours organized.",
      url: WEBVIEW_ROUTES.teamClock,
    },
    {
      label: "My Work",
      description: "Open your current store tasks and assignments.",
      url: WEBVIEW_ROUTES.teamMyWork,
    },
  ];

  const teamSecondary = [
    {
      label: "Chat",
      url: WEBVIEW_ROUTES.teamChat,
    },
    {
      label: "Clock",
      url: WEBVIEW_ROUTES.teamClock,
    },
    {
      label: "Settings",
      url: WEBVIEW_ROUTES.customerSettings,
    },
  ];

  const clientPrimary = [
    {
      label: "Shop Meals",
      description: "Open Avomeal products and start a fresh order.",
      url: WEBVIEW_ROUTES.storeHome,
    },
    {
      label: "Reorder",
      description: "Review previous orders before adding items again.",
      url: WEBVIEW_ROUTES.reorder,
    },
    {
      label: "My Orders",
      description: "See recent orders, status and purchase history.",
      url: WEBVIEW_ROUTES.customerOrders,
    },
    {
      label: "Subscriptions",
      description: "Manage active meal subscriptions if available.",
      url: WEBVIEW_ROUTES.subscriptions,
    },
  ];

  const clientSecondary = [
    {
      label: "Nutrition Advisor",
      url: WEBVIEW_ROUTES.nutritionAdvisor,
    },
    {
      label: "Wellness Advisor",
      url: WEBVIEW_ROUTES.wellnessAdvisor,
    },
    {
      label: "Cart",
      url: WEBVIEW_ROUTES.cart,
    },
    {
      label: "Settings",
      url: WEBVIEW_ROUTES.customerSettings,
    },
  ];

  const configByLevel = {
    1: {
      badge: `${BUSINESS_CONFIG.brandName} Admin`,
      title: "Run the Avomeal store from one clean dashboard.",
      subtitle:
        "Manage catalog, monitor orders, and control customers and team access from a simpler operation panel.",
      heroLabel: "Orders",
      heroDescription: "Open the main store order area and manage daily activity.",
      heroUrl: WEBVIEW_ROUTES.adminStoreOrders,
      heroButton: "Open Orders",
      primary: ownerPrimary,
      secondary: ownerSecondary,
      sectionTitle: "Main Areas",
      sectionSubtitle: "The three core sections of the store operation.",
      exploreTitle: "More Tools",
      exploreSubtitle: "Useful secondary areas without overloading the main dashboard.",
      finalTitle: "Keep the operation clean",
      finalText:
        `Use these areas as the main control points for products, orders, and people inside ${BUSINESS_CONFIG.brandName}.`,
      finalPrimaryButton: "Go to Orders",
      finalPrimaryUrl: WEBVIEW_ROUTES.adminStoreOrders,
      finalSecondaryButton: "Manage Products",
      finalSecondaryUrl: "panel/planner-hub/store/products/home",
    },
    2: {
      badge: `${BUSINESS_CONFIG.brandName} Admin`,
      title: "Run the Avomeal store from one clean dashboard.",
      subtitle:
        "Manage catalog, monitor orders, and control customers and team access from a simpler operation panel.",
      heroLabel: "Orders",
      heroDescription: "Open the main store order area and manage daily activity.",
      heroUrl: WEBVIEW_ROUTES.adminStoreOrders,
      heroButton: "Open Orders",
      primary: ownerPrimary,
      secondary: ownerSecondary,
      sectionTitle: "Main Areas",
      sectionSubtitle: "The three core sections of the store operation.",
      exploreTitle: "More Tools",
      exploreSubtitle: "Useful secondary areas without overloading the main dashboard.",
      finalTitle: "Keep the operation clean",
      finalText:
        `Use these areas as the main control points for products, orders, and people inside ${BUSINESS_CONFIG.brandName}.`,
      finalPrimaryButton: "Go to Orders",
      finalPrimaryUrl: WEBVIEW_ROUTES.adminStoreOrders,
      finalSecondaryButton: "Manage Products",
      finalSecondaryUrl: "panel/planner-hub/store/products/home",
    },
    3: {
      badge: `${BUSINESS_CONFIG.brandName} Admin`,
      title: "Run the Avomeal store from one clean dashboard.",
      subtitle:
        "Manage catalog, monitor orders, and control customers and team access from a simpler operation panel.",
      heroLabel: "Orders",
      heroDescription: "Open the main store order area and manage daily activity.",
      heroUrl: WEBVIEW_ROUTES.adminStoreOrders,
      heroButton: "Open Orders",
      primary: ownerPrimary,
      secondary: ownerSecondary,
      sectionTitle: "Main Areas",
      sectionSubtitle: "The three core sections of the store operation.",
      exploreTitle: "More Tools",
      exploreSubtitle: "Useful secondary areas without overloading the main dashboard.",
      finalTitle: "Keep the operation clean",
      finalText:
        `Use these areas as the main control points for products, orders, and people inside ${BUSINESS_CONFIG.brandName}.`,
      finalPrimaryButton: "Go to Orders",
      finalPrimaryUrl: WEBVIEW_ROUTES.adminStoreOrders,
      finalSecondaryButton: "Manage Products",
      finalSecondaryUrl: "panel/planner-hub/store/products/home",
    },
    4: {
      badge: "Team Dashboard",
      title: "Keep Avomeal orders moving.",
      subtitle:
        "Open assigned orders, clock in, and stay aligned with store operations.",
      heroLabel: "Store Orders",
      heroDescription: "Open assigned preparation and delivery work.",
      heroUrl: WEBVIEW_ROUTES.teamStoreOrders,
      heroButton: "Open Orders",
      primary: teamPrimary,
      secondary: teamSecondary,
      sectionTitle: "Main Areas",
      sectionSubtitle: "Your most important work areas in one place.",
      exploreTitle: "More Tools",
      exploreSubtitle: "Secondary tools that support the team workflow.",
      finalTitle: "Keep the store operation moving",
      finalText:
        "Stay focused on store work, time tracking, payroll, and daily operational support.",
      finalPrimaryButton: "Open Store Orders",
      finalPrimaryUrl: WEBVIEW_ROUTES.teamStoreOrders,
      finalSecondaryButton: "Track Time",
      finalSecondaryUrl: WEBVIEW_ROUTES.teamClock,
    },
    5: {
      badge: BUSINESS_CONFIG.brandName,
      title: "Shop, reorder and manage your meals faster.",
      subtitle:
        "Jump straight into products, recent orders, subscriptions and nutrition tools.",
      heroLabel: "Shop Meals",
      heroDescription: "Open the Avomeal store and build your next order.",
      heroUrl: WEBVIEW_ROUTES.storeHome,
      heroButton: "Start Order",
      primary: clientPrimary,
      secondary: clientSecondary,
      sectionTitle: "Main Areas",
      sectionSubtitle: "Fast access to ordering, reordering and account actions.",
      exploreTitle: "Tools & Account",
      exploreSubtitle: "Nutrition tools, cart and profile access.",
      finalTitle: "Ready for your next order?",
      finalText:
        `Choose your meals, support your wellness goals, and keep your week easier with ${BUSINESS_CONFIG.brandName}.`,
      finalPrimaryButton: "Start New Order",
      finalPrimaryUrl: WEBVIEW_ROUTES.storeHome,
      finalSecondaryButton: "Reorder",
      finalSecondaryUrl: WEBVIEW_ROUTES.reorder,
    },
  };

  return configByLevel[level] || configByLevel[5];
}

export function Panel() {
  const navigation = useNavigation();
  const { userData, updateUserData } = useUserContext();

  const [token, setToken] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [isChangingAccount, setIsChangingAccount] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [changinAccountOnProgress, setChanginAccountOnProgress] = useState(false);

  const requestedLevel = Number(userData?.level || 5);
  const level = [1, 4, 5].includes(requestedLevel) ? requestedLevel : 5;
  const panelConfig = getPanelConfig(level);

  const onChangeAccountConfirm = useCallback(async () => {
    const payload = selectedAccount;
    const start = Date.now();

    setChanginAccountOnProgress(true);
    setIsChangingAccount(false);
    setSelectedAccount(null);

    const response = await changeAccountType(token, payload);

    if (response == null) {
      setChanginAccountOnProgress(false);
      return;
    }

    const elapse = Date.now() - start;
    const remaining = 2000 - elapse;

    if (remaining > 0) {
      await sleep(2);
    }

    setChanginAccountOnProgress(false);
    updateUserData({ level: payload });
    AlertMain("Account type changed successfully");
  }, [selectedAccount, token, updateUserData]);

  const onChangeAccountCancel = useCallback(() => {
    setIsChangingAccount(false);
    setSelectedAccount(null);
  }, []);

  const availableAccounts = useMemo(() => {
    if (userData == null) return [];

    return accountTypes
      .filter((elm) => elm.value !== Number(userData.level))
      .map((elm) => ({
        value: elm.value,
        label: `Change to a ${elm.label}`,
      }));
  }, [userData]);

  useEffect(() => {
    AsyncStorage.getItem("Token").then(setToken);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (!token) return;
    if (Platform.OS === "android" && Constants.appOwnership === "expo") {
      return;
    }

    let cancelled = false;

    async function loadExpoNotifications() {
      try {
        const Notifications = require("expo-notifications");
        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ??
          Constants.easConfig?.projectId;

        if (!projectId) {
          console.warn(
            "[Expo push] Falta extra.eas.projectId en app.json — no se puede obtener el token."
          );
          return;
        }

        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted" || cancelled) return;

        const expoPushToken = await Notifications.getExpoPushTokenAsync({
          projectId,
        });
        if (cancelled) return;

        await axios.post(
          "api/set-expo-push-token",
          {
            expo_push_token: expoPushToken.data,
            api_token: token,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (__DEV__) {
          console.log(
            "[Expo push] Registrado en el servidor. Prueba en https://expo.dev/notifications — token:",
            expoPushToken.data
          );
        }
      } catch (error) {
        console.error("Could not get Expo push token:", error);
      }
    }

    loadExpoNotifications();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const navigateTo = (fullPath) => {
    if (!token || !fullPath) return;

    const cleanUrl = fullPath.replace(/^https?:\/\/app\.vnvevents\.com\//, "");
    navigation.navigate("PanelView", {
      url: cleanUrl,
      key: getUUID(),
    });
  };

  if (!userData) {
    return (
      <View style={styles.loader}>
        <Text style={styles.loaderText}>Loading...</Text>
      </View>
    );
  }

  return (
    <BottomContainer>
      <Animated.ScrollView
        style={[styles.screen, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.backgroundLayer}>
          <View style={styles.bgOrbTop} />
          <View style={styles.bgOrbMiddle} />
          <View style={styles.bgOrbBottom} />
          <View style={styles.bgOrbSoft} />
        </View>

        <View style={styles.inner}>
          <TouchableOpacity
            activeOpacity={0.96}
            onPress={() => navigateTo(panelConfig.heroUrl)}
            style={styles.heroCard}
          >
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{panelConfig.badge}</Text>
            </View>

            <Text style={styles.heroTitle}>{panelConfig.title}</Text>
            <Text style={styles.heroSubtitle}>{panelConfig.subtitle}</Text>

            <View style={styles.heroActionCard}>
              <Text style={styles.heroActionLabel}>{panelConfig.heroLabel}</Text>
              <Text style={styles.heroActionDescription}>
                {panelConfig.heroDescription}
              </Text>

              <View style={styles.heroButton}>
                <Text style={styles.heroButtonText}>{panelConfig.heroButton}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{panelConfig.sectionTitle}</Text>
            <Text style={styles.sectionSubtitle}>
              {panelConfig.sectionSubtitle}
            </Text>
          </View>

          <View style={styles.primaryGrid}>
            {panelConfig.primary.map((item, idx) => (
              <TouchableOpacity
                key={`${item.label}-${idx}`}
                activeOpacity={0.92}
                onPress={() => navigateTo(item.url)}
                style={styles.primaryCard}
              >
                <Image
                  source={getIconByIndex(idx)}
                  style={styles.primaryIcon}
                  resizeMode="contain"
                />

                <Text style={styles.primaryCardTitle}>{item.label}</Text>
                <Text style={styles.primaryCardDescription}>
                  {item.description}
                </Text>

                <View style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Open</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {panelConfig.secondary?.length > 0 && (
            <>
              <View style={styles.sectionHeaderCompact}>
                <Text style={styles.sectionTitle}>{panelConfig.exploreTitle}</Text>
                <Text style={styles.sectionSubtitle}>
                  {panelConfig.exploreSubtitle}
                </Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.exploreRow}
              >
                {panelConfig.secondary.map((item, idx) => (
                  <TouchableOpacity
                    key={`${item.label}-${idx}`}
                    activeOpacity={0.92}
                    onPress={() => navigateTo(item.url)}
                    style={styles.exploreCard}
                  >
                    <Image
                      source={getIconByIndex(idx + 3)}
                      style={styles.exploreIcon}
                      resizeMode="contain"
                    />
                    <Text style={styles.exploreText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          <View style={styles.finalCard}>
            <Text style={styles.finalTitle}>{panelConfig.finalTitle}</Text>
            <Text style={styles.finalText}>{panelConfig.finalText}</Text>

            <TouchableOpacity
              activeOpacity={0.92}
              onPress={() => navigateTo(panelConfig.finalPrimaryUrl)}
              style={styles.finalPrimaryButton}
            >
              <Text style={styles.finalPrimaryButtonText}>
                {panelConfig.finalPrimaryButton}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.92}
              onPress={() => navigateTo(panelConfig.finalSecondaryUrl)}
              style={styles.finalSecondaryButton}
            >
              <Text style={styles.finalSecondaryButtonText}>
                {panelConfig.finalSecondaryButton}
              </Text>
            </TouchableOpacity>
          </View>

          <QuestionAlert
            visible={isChangingAccount}
            question={"Would you like to change your account type?"}
            options={availableAccounts}
            selectedValue={selectedAccount}
            onChange={setSelectedAccount}
            onCancel={onChangeAccountCancel}
            onConfirm={onChangeAccountConfirm}
          />
        </View>
      </Animated.ScrollView>

      <LoadingOverlay
        visible={changinAccountOnProgress}
        backgroundColor="rgba(0,0,0,0.88)"
      />
    </BottomContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#66371c",
  },

  loaderText: {
    color: "#fff7ea",
    fontSize: 16,
    fontWeight: "700",
  },

  screen: {
    flex: 1,
    backgroundColor: "#66371c",
  },

  scrollContent: {
    paddingBottom: 30,
  },

  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#66371c",
  },

  bgOrbTop: {
    position: "absolute",
    top: -120,
    right: -50,
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: "rgba(245, 166, 35, 0.16)",
  },

  bgOrbMiddle: {
    position: "absolute",
    top: "26%",
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
    right: "10%",
    width: 180,
    height: 180,
    borderRadius: 180,
    backgroundColor: "rgba(255, 194, 122, 0.07)",
  },

  inner: {
    paddingHorizontal: 16,
    paddingTop: 18,
  },

  heroCard: {
    backgroundColor: "#4b2815",
    borderRadius: 30,
    padding: 22,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.22,
    shadowRadius: 26,
    elevation: 14,
  },

  heroBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    marginBottom: 16,
  },

  heroBadgeText: {
    color: "#ffd18a",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },

  heroTitle: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: "900",
    color: "#fff7ea",
    marginBottom: 10,
    letterSpacing: -0.8,
  },

  heroSubtitle: {
    fontSize: 14,
    lineHeight: 23,
    color: "rgba(255, 240, 220, 0.88)",
    marginBottom: 16,
  },

  heroActionCard: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 16,
  },

  heroActionLabel: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "900",
    color: "#fff7ea",
    marginBottom: 6,
  },

  heroActionDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: "#f3dfbf",
    marginBottom: 12,
  },

  heroButton: {
    alignSelf: "flex-start",
    backgroundColor: "#f5a623",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
  },

  heroButtonText: {
    color: "#2a1a11",
    fontWeight: "900",
    fontSize: 13,
  },

  sectionHeader: {
    marginBottom: 14,
  },

  sectionHeaderCompact: {
    marginTop: 4,
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "900",
    color: "#fff7ea",
    marginBottom: 6,
    letterSpacing: -0.6,
  },

  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: "rgba(255, 240, 220, 0.82)",
  },

  primaryGrid: {
    gap: 16,
    marginBottom: 26,
  },

  primaryCard: {
    backgroundColor: "#f7efe4",
    borderRadius: 28,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(236, 217, 191, 0.98)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    alignItems: "center",
  },

  primaryIcon: {
    width: "100%",
    height: 112,
    marginBottom: 12,
  },

  primaryCardTitle: {
    fontSize: 19,
    lineHeight: 23,
    fontWeight: "900",
    color: "#24160b",
    textAlign: "center",
    marginBottom: 6,
  },

  primaryCardDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: "#6f6255",
    textAlign: "center",
    marginBottom: 12,
  },

  primaryButton: {
    width: "100%",
    backgroundColor: "#f59e0b",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#2a1a11",
    fontWeight: "900",
    fontSize: 14,
  },

  exploreRow: {
    paddingBottom: 8,
    paddingRight: 8,
  },

  exploreCard: {
    width: 170,
    backgroundColor: "#f7efe4",
    borderRadius: 22,
    padding: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "rgba(236, 217, 191, 0.98)",
    alignItems: "center",
  },

  exploreIcon: {
    width: "100%",
    height: 72,
    marginBottom: 8,
  },

  exploreText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "800",
    color: "#24160b",
    textAlign: "center",
  },

  finalCard: {
    backgroundColor: "#4b2815",
    borderRadius: 28,
    padding: 20,
    marginTop: 4,
    marginBottom: 10,
  },

  finalTitle: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "900",
    color: "#fff7ea",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.6,
  },

  finalText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#f3dfbf",
    textAlign: "center",
    marginBottom: 16,
  },

  finalPrimaryButton: {
    backgroundColor: "#f5a623",
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 10,
  },

  finalPrimaryButtonText: {
    color: "#2a1a11",
    fontWeight: "900",
    fontSize: 14,
  },

  finalSecondaryButton: {
    borderRadius: 999,
    paddingVertical: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  finalSecondaryButtonText: {
    color: "#fff7ea",
    fontWeight: "800",
    fontSize: 14,
  },
});
