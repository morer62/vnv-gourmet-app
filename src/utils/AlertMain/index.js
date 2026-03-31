import { Alert } from 'react-native';

export default function AlertMain(alertMessage = '') {
    if (!alertMessage || alertMessage.trim() === '') return;

    Alert.alert('Important', alertMessage, [{ text: 'OK' }], { cancelable: true });
}
