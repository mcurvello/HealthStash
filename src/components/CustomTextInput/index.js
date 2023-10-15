import React from "react";
import { TextInput } from "react-native-paper";

function CustomTextInput({
  value,
  onChangeText,
  placeholder,
  icon,
  onPress,
  secureTextEntry,
  width,
  color,
}) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={color || "#fff"}
      mode="outlined"
      value={value}
      right={
        icon && (
          <TextInput.Icon
            iconColor={color || "#fff"}
            icon={icon}
            onPress={onPress}
          />
        )
      }
      style={{
        width: width || 370,
        backgroundColor: "transparent",
        marginBottom: 8,
      }}
      textColor={color || "#fff"}
      outlineStyle={{
        borderRadius: 50,
        borderColor: color || "#fff",
        borderWidth: 0.5,
      }}
      contentStyle={{ fontFamily: "poppins-regular", fontSize: 15 }}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  );
}

export default CustomTextInput;
