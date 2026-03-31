import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors } from "../../theme/colors";

export const CustonButton = ({
  onPress,
  text,
  type = "Primary",
  isDisabled = false,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.Container, styles[`Container_${type}`]]}
      disabled={isDisabled}
    >
      <Text style={[styles.Text, styles[`Text_${type}`]]}>{text}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  Container: {
    width: "100%",
    padding: 14,
    marginVertical: 6,
    alignItems: "center",
    borderRadius: 10,
  },
  Text: {
    fontWeight: "600",
    fontSize: 16,
    color: colors.textPrimary,
  },
  Text_Secondary: {
    fontWeight: "600",
    color: colors.textPrimary,
  },
  Text_Tertiary: {
    color: colors.accent,
    fontWeight: "600",
  },
  Container_Disabled: {
    backgroundColor: colors.buttonDisabled,
    opacity: 0.6,
  },
  Container_Primary: {
    backgroundColor: colors.accent,
  },
  Container_Secondary: {
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
  },
  Container_Tertiary: {
    backgroundColor: "transparent",
  },
});
