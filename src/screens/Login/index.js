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
import {
  Avatar,
  Button,
  SegmentedButtons,
  Text,
  TextInput,
} from "react-native-paper";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";
import { StatusBar } from "expo-status-bar";

export const Login = ({ navigation }) => {
  const [document, setDocument] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState("patient");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const { onLogin } = useContext(AuthenticationContext);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <View
            style={{
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              paddingBottom: 16,
              paddingTop: 48,
              paddingHorizontal: 16,
              flex: 1,
            }}
          >
            <>
              <Image source={require("../../../assets/logo.png")} />
              <Text
                variant="displayMedium"
                style={{
                  fontWeight: 500,
                  color: "#fff",
                  marginTop: 8,
                  marginBottom: 40,
                  fontFamily: "poppins-bold",
                }}
              >
                Health Stash
              </Text>
              <TextInput
                mode="outlined"
                placeholder="E-mail"
                value={document}
                contentStyle={{ fontFamily: "poppins-regular" }}
                placeholderTextColor="#fff"
                textColor="#fff"
                right={<TextInput.Icon iconColor="#fff" icon="account" />}
                style={{
                  backgroundColor: "transparent",
                  marginBottom: 8,
                  width: "100%",
                }}
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
                contentStyle={{ fontFamily: "poppins-regular" }}
                right={
                  <TextInput.Icon
                    iconColor="#fff"
                    icon="eye"
                    onPress={() => {
                      setSecureTextEntry(!secureTextEntry);
                      return false;
                    }}
                  />
                }
                style={{
                  backgroundColor: "transparent",
                  width: "100%",
                }}
                outlineStyle={{
                  borderRadius: 50,
                  borderColor: "#fff",
                  borderWidth: 1,
                }}
                secureTextEntry={secureTextEntry}
                onChangeText={(text) => setPassword(text)}
              />
              <View style={{ alignItems: "flex-start", marginTop: 40 }}>
                <Text
                  variant="titleMedium"
                  style={{
                    color: "#fff",
                    marginBottom: 8,
                    fontFamily: "poppins-regular",
                  }}
                >
                  Selecione o tipo de usuário:
                </Text>
                <SegmentedButtons
                  value={profile}
                  onValueChange={setProfile}
                  theme={{
                    colors: {
                      secondaryContainer: "#fff",
                      onSurface: "#fff",
                      primary: "#0083C5",
                      outline: "#fff",
                    },
                  }}
                  style={{ marginBottom: 40 }}
                  buttons={[
                    { label: "Paciente", value: "patient" },
                    { label: "Médico", value: "practitioner" },
                    { label: "Clínica", value: "clinic" },
                  ]}
                />
              </View>

              <Button
                mode="contained-tonal"
                buttonColor="#fff"
                textColor="#0083C5"
                style={{
                  width: "100%",
                  borderRadius: 50,
                }}
                onPress={() => onLogin(document, password, profile)}
                contentStyle={{ height: 55 }}
              >
                ENTRAR
              </Button>
            </>

            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("Register")}
            >
              <Text
                variant="labelLarge"
                style={{ fontFamily: "poppins-regular", color: "#fff" }}
              >
                Não possui uma conta
              </Text>
              <Avatar.Icon
                icon="chevron-right"
                color="pink"
                backgroundColor="transparent"
                size={48}
                style={{ marginLeft: -12 }}
                onPress={() => console.log("Pressed")}
              />
            </TouchableOpacity>
          </View>
        </Container>
      </TouchableWithoutFeedback>
      <StatusBar style="light" />
    </KeyboardAvoidingView>
  );
};
