import React, { useContext, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Container } from "./styles";
import { Button, Text, TextInput } from "react-native-paper";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";
import { StatusBar } from "expo-status-bar";

export const Login = ({ navigation }) => {
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const { onLogin, isLoading, error } = useContext(AuthenticationContext);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <StatusBar style="light" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Image source={require("../../../assets/logo.png")} />
          <Text
            variant="headlineSmall"
            style={{ fontWeight: 600, color: "#fff", marginTop: 8 }}
          >
            Health Stash
          </Text>
          <View
            style={{
              marginTop: 80,
            }}
          >
            <TextInput
              mode="outlined"
              placeholder="E-mail"
              value={document}
              placeholderTextColor="#fff"
              textColor="#fff"
              left={<TextInput.Icon iconColor="#fff" icon="account" />}
              style={{ backgroundColor: "transparent", marginBottom: 24 }}
              outlineStyle={{
                borderRadius: 50,
                borderColor: "#fff",
                borderWidth: 1,
              }}
              onChangeText={(text) => setDocument(text)}
            />
            <TextInput
              mode="outlined"
              placeholder="Senha"
              value={password}
              placeholderTextColor="#fff"
              textColor="#fff"
              left={
                <TextInput.Icon
                  iconColor="#fff"
                  icon="eye"
                  onPress={() => {
                    setSecureTextEntry(!secureTextEntry);
                    return false;
                  }}
                />
              }
              style={{ backgroundColor: "transparent", marginBottom: 64 }}
              outlineStyle={{
                borderRadius: 50,
                borderColor: "#fff",
                borderWidth: 1,
              }}
              secureTextEntry={secureTextEntry}
              onChangeText={(text) => setPassword(text)}
            />
            <Button
              mode="contained-tonal"
              buttonColor="#fff"
              textColor="#0083C5"
              style={{ marginTop: 8, width: 330, borderRadius: 50 }}
              onPress={() => onLogin(document, password)}
              contentStyle={{ height: 55 }}
            >
              ENTRAR
            </Button>
          </View>
          <View
            style={{
              justifyContent: "center",
              position: "absolute",
              width: "100%",
              alignItems: "center",
              bottom: 40,
            }}
          >
            <Text variant="labelLarge" style={{ color: "#fff" }}>
              Não possui uma conta?{" "}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={() => navigation.navigate("Patient")}>
                <Text
                  variant="labelLarge"
                  style={{
                    color: "#fff",
                    textDecorationLine: "underline",
                    marginRight: 24,
                  }}
                >
                  Cadastro de paciente
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Practitioner")}
              >
                <Text
                  variant="labelLarge"
                  style={{ color: "#fff", textDecorationLine: "underline" }}
                >
                  Cadastro de médico
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
