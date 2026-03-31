import * as AppleAuthentication from 'expo-apple-authentication';
import { useCallback } from 'react';
import { Platform, StyleSheet } from 'react-native';

export default function AppleSignIn({ onSignIn, onError }) {


    const onInternalPress = useCallback(async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });
            
            onSignIn(credential);
          } catch (e) {
            onError(e);
        }
    }, [onSignIn, onError])

    if (Platform.OS === 'android') {
        return <></>

        // return (
        //     <View style={{...styles.button, ...styles.buttonAndroid}}>
        //         <FontAwesome name="apple" size={18} color="white" style={{ marginRight: 8 }} />
        //         <Text style={{ color: "white" }}>Apple</Text>
        //     </View>
        // )
    }

    return (
        <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.button}
        onPress={onInternalPress}
      />
    )
}

const styles = StyleSheet.create({
  button: {
    width: "50%",
    height: 48,
  },
  buttonAndroid: {
    flexDirection: 'row',
    display: 'flex',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: "black"
  }
});