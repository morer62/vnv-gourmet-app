import AsyncStorage from '@react-native-async-storage/async-storage'
import { DrawerContentScrollView } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native'
import { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
 
import DrawerLink from './DrawerLink'
import DrawerTitle from './DrawerTitle'

export default function DrawerAction() {
  const navigation = useNavigation()

  const CTAS = useMemo(() => [
    {
      icon: 'home',
      color: '#0fb58d',
      label: 'Dashboard',
      callback: () => navigation.navigate('Panel')
    },
    {
      icon: 'settings',
      color: '#0fb58d',
      label: 'Settings',
      callback: () => navigation.navigate('PanelView', { url: 'private/Settings' })
    },
    {
      icon: 'language',
      color: '#0fb58d',
      label: 'VNVEvents.com',
      callback: () => navigation.navigate('PanelView', { url: 'https://vnvevents.com' })
    },
    {
      icon: 'exit-to-app',
      color: '#FF3333',
      label: 'Logout',
      callback: async () => {
        await AsyncStorage.multiRemove(['Token', 'UserData'])
        navigation.reset({
          index: 0,
          routes: [{ name: 'loginNavigator', state: { routes: [{ name: 'SignIn' }] } }]
        })
      }
    }
  ], [navigation])

  return (
    <View style={styles.container}>
      <DrawerContentScrollView>
         
        <DrawerTitle />
        {CTAS.map((elm, i) => (
          <DrawerLink key={i} item={elm} />
        ))}
      </DrawerContentScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161b22'
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 20
  },
  logo: {
    width: 150,
    height: 40
  }
})
