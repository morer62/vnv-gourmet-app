import { StyleSheet, Text, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { useUserContext } from '../../../context/userContext'; // ✅ RUTA CORRECTA

export default function DrawerTitle() {
  const { userData } = useUserContext()

  const initials = userData?.name
    ?.split(' ')
    ?.map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <View style={styles.container}>
      <Avatar
        rounded
        size="medium"
        title={initials || '👤'}
        containerStyle={styles.avatar}
      />
      <Text style={styles.name}>{userData?.name || 'User'}</Text>
      <Text style={styles.role}>VNV Member</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    alignItems: 'center',
    backgroundColor: '#161b22'
  },
  avatar: {
    backgroundColor: '#0fb58d',
    marginBottom: 10
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0fb58d'
  },
  role: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4
  }
})
