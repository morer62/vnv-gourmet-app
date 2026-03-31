import { API_URL } from '@env';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as WebBrowser from 'expo-web-browser';
import { useCallback } from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

// local imports
import styles from './styles';

function DrawerLink({ item }) {
  const navigation = useNavigation();
  const { icon, color, label, callback, url } = item;

  const linkCallback = useCallback(async () => {
    if (callback) {
      return callback();
    }

    // Navegación interna
    if (url && !url.startsWith('http')) {
      navigation.navigate('PanelView', {
        url,
        key: Date.now().toString()
      });
      return;
    }

    // Navegación externa
    const token = await AsyncStorage.getItem('Token');
    const openUrl = `${API_URL}Panel/Tokenapi/${token}/${url}`;
    await WebBrowser.openBrowserAsync(openUrl);
  }, [callback, url]);

  return (
    <View style={styles.drawer_link_container}>
      <TouchableOpacity onPress={linkCallback} style={styles.drawer_link_pressable}>
        <MaterialIcons name={icon} color={color} size={25} style={{ marginRight: 10 }} />
        <Text style={styles.drawer_link_label}>{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default DrawerLink;
