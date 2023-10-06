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
}) {
  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor="#fff"
      mode="outlined"
      value={value}
      left={<TextInput.Icon iconColor="#fff" icon={icon} onPress={onPress} />}
      style={{
        width: width || 370,
        backgroundColor: "transparent",
        marginBottom: 8,
      }}
      textColor="#fff"
      outlineStyle={{
        borderRadius: 50,
        borderColor: "#fff",
        borderWidth: 0.5,
      }}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  );
}

export default CustomTextInput;
