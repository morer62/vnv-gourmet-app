import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  // Logo
  logo: {
    width: 140,
    height: 40,
    marginBottom: 10
  },
  logo_container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#161b22'
  },
  logo_label: {
    fontSize: 16,
    textAlign: 'center',
    color: '#ffffff',
    fontWeight: '600'
  },

  // DrawerLink
  drawer_link_container: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  drawer_link_pressable: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  drawer_link_label: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500'
  }
})

export default styles
