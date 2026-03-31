import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';

export default function LoadingOverlay({ visible, backgroundColor = 'rgba(0, 0, 0, 0.4)', loadingColor = "#fff" }) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View style={{...styles.overlay, backgroundColor}}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={loadingColor} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // translucent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    padding: 20,
    borderRadius: 10,
  },
});
