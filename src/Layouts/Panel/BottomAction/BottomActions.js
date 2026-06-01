import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { buildTokenWebViewUrl, WEBVIEW_ROUTES } from '../../../config/apiRoutes';
import { useUserContext } from '../../../context/userContext';
import getUUID from '../../../utils/uuid';

export default function BottomAction() {
  const navigation = useNavigation();
  const route = useRoute();
  const { userData } = useUserContext();

  const requestedLevel = Number(userData?.level || 5);
  const level = [1, 4, 5].includes(requestedLevel) ? requestedLevel : 5;

  const ordersUrl = useMemo(() => {
    if (level === 5) return WEBVIEW_ROUTES.customerOrders;
    if (level === 4) return WEBVIEW_ROUTES.teamStoreOrders;
    return WEBVIEW_ROUTES.adminStoreOrders;
  }, [level]);

  const shopUrl = useMemo(() => {
    if (level === 4) return WEBVIEW_ROUTES.teamMyWork;
    if (level === 1) return WEBVIEW_ROUTES.adminStoreOrders;
    return WEBVIEW_ROUTES.storeHome;
  }, [level]);

  const isActive = useCallback(
    (screenName, url) => {
      if (route.name === 'Panel' && screenName === 'Panel') {
        return true;
      }
      if (route.name === 'PanelView' && route.params?.url === url) {
        return true;
      }
      return false;
    },
    [route]
  );

  const cta = useMemo(
    () => [
      {
        icon: 'home',
        screenName: 'Panel',
        url: null,
        callback: () => navigation.navigate('Panel')
      },
      {
        icon: level === 5 ? 'restaurant-menu' : 'work',
        screenName: 'PanelView',
        url: shopUrl,
        callback: () =>
          navigation.navigate('PanelView', {
            url: shopUrl,
            key: getUUID()
          })
      },
      {
        icon: 'assignment',
        screenName: 'PanelView',
        url: ordersUrl,
        callback: () =>
          navigation.navigate('PanelView', {
            url: ordersUrl,
            key: getUUID()
          })
      },
      {
        icon: 'settings',
        screenName: 'PanelView',
        url: WEBVIEW_ROUTES.customerSettings,
        callback: () =>
          navigation.navigate('PanelView', {
            url: WEBVIEW_ROUTES.customerSettings,
            key: getUUID()
          })
      },
      {
        icon: 'exit-to-app',
        screenName: null,
        url: null,
        color: '#ff5a4f',
        callback: async () => {
          await AsyncStorage.multiRemove(['Token', 'UserData']);
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'loginNavigator',
                state: { routes: [{ name: 'SignIn' }] }
              }
            ]
          });
        }
      }
    ],
    [level, navigation, ordersUrl, shopUrl]
  );

  const actionUrl = useCallback(async ({ callback, url }) => {
    if (callback) {
      return callback();
    }

    const token = await AsyncStorage.getItem('Token');
    const openUrl = buildTokenWebViewUrl(token, url);
    await WebBrowser.openBrowserAsync(openUrl);
  }, []);

  return (
    <View style={styles.outer}>
      <View style={styles.wrapper}>
        <View style={styles.container}>
          {cta.map((elm, key) => {
            let iconColor = 'rgba(255, 247, 234, 0.62)';
            let isCurrent = false;

            if (elm.color) {
              iconColor = elm.color;
            } else if (isActive(elm.screenName, elm.url)) {
              iconColor = '#f5a623';
              isCurrent = true;
            }

            return (
              <TouchableOpacity
                key={key}
                onPress={() => actionUrl(elm)}
                activeOpacity={0.85}
                style={[styles.actionButton, isCurrent && styles.actionButtonActive]}
              >
                <MaterialIcons name={elm.icon} size={30} color={iconColor} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    paddingTop: 0,
    paddingBottom: 0,
    transform: [{ translateY: -10 }],
  },

  wrapper: {
    backgroundColor: '#2f190d',
    borderTopWidth: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 209, 138, 0.14)',
    borderRadius: 22,
    overflow: 'hidden',
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#2f190d',
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 8,
    elevation: 10,
  },

  actionButton: {
    minWidth: 54,
    minHeight: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  actionButtonActive: {
    backgroundColor: 'rgba(245, 166, 35, 0.14)',
  }
});
