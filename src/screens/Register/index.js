import React, { useContext, useState } from "react";
import { Container, Header } from "./styles";
import { Button, Text, TextInput } from "react-native-paper";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";
import CustomTextInput from "../../components/CustomTextInput";

export const Register = ({ navigation }) => {
  const [document, setDocument] = useState("");
  const [isValidDocument, setIsValidDocument] = useState(false);
  const [isPatient, setIsPatient] = useState(false);
  const [phone, setPhone] = useState("");

  const verificaCPFouCRM = (dado) => {
    const cpfPattern = /^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/;
    const crmPattern = /^\d{5}$/;

    if (cpfPattern.test(dado)) {
      setIsPatient(true);
      setIsValidDocument(true);
      navigation.navigate("Patient", { phone: phone });
    } else if (crmPattern.test(dado)) {
      setIsPatient(false);
      setIsValidDocument(true);
      navigation.navigate("Practitioner", { phone: phone });
    } else {
      setIsPatient(false);
      setIsValidDocument(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container
          style={{ justifyContent: "space-between", paddingVertical: 60 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              paddingHorizontal: 24,
            }}
          >
            <View>
              <Text
                variant="displaySmall"
                style={{
                  fontFamily: "poppins-bold",
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                Cadastro
              </Text>

              <Text
                variant="headlineMedium"
                style={{
                  fontFamily: "poppins-bold",
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                Health Stash
              </Text>
            </View>

            <Image source={require("../../../assets/logo2.png")} />
          </View>
          <View style={{ marginTop: 30 }}>
            <View style={{ alignItems: "center", marginBottom: 48 }}>
              <Text
                variant="bodyLarge"
                style={{
                  fontFamily: "poppins-regular",
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                Para pacientes: informe o seu CPF
              </Text>
              <Text
                variant="bodyLarge"
                style={{
                  fontFamily: "poppins-regular",
                  fontWeight: 600,
                  color: "#fff",
                }}
              >
                Para médicos: informe o seu CRM
              </Text>
            </View>
            <CustomTextInput
              value={document}
              onChangeText={(text) => setDocument(text)}
              placeholder="CPF / CRM"
              icon="card-account-details-outline"
            />
            <CustomTextInput
              value={phone}
              onChangeText={(text) => setPhone(text)}
              placeholder="Telefone"
              icon="cellphone"
            />
          </View>
          <Button
            mode="contained-tonal"
            buttonColor="#FFF"
            textColor="#0083C5"
            style={{
              width: 360,
              borderRadius: 50,
              marginTop: 30,
            }}
            labelStyle={{ fontWeight: 800 }}
            onPress={async () => {
              verificaCPFouCRM(document);
            }}
            contentStyle={{ height: 55 }}
          >
            CONTINUAR
          </Button>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
