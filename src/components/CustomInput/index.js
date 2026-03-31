import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

export default function CustomInput({ value, onChange, placeHolder, isSecured }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordVisible = isSecured && !showPassword;

  return (
    <View style={styles.wrapper}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeHolder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={isPasswordVisible}
        style={styles.input}
      />
      {isSecured && (
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword((v) => !v)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <MaterialIcons
            name={showPassword ? "visibility-off" : "visibility"}
            size={22}
            color={colors.textMuted}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    marginVertical: 5,
  },
  input: {
    backgroundColor: colors.bgInput,
    width: "100%",
    height: 48,
    borderWidth: 1,
    paddingLeft: 12,
    paddingRight: 48,
    borderRadius: 10,
    borderColor: colors.border,
    color: colors.textPrimary,
    fontSize: 16,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
});