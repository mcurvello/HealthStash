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

export const Patient = ({ navigation }) => {
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [alergias, setAlergias] = useState("");
  const [comorbidades, setComorbidades] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const { onRegister, isLoading, error } = useContext(AuthenticationContext);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
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
                style={{ fontWeight: 600, color: "#fff" }}
              >
                Cadastro
              </Text>
              <Text
                variant="displaySmall"
                style={{ fontWeight: 600, color: "#fff" }}
              >
                Paciente
              </Text>
              <Text
                variant="headlineMedium"
                style={{ fontWeight: 600, color: "#fff" }}
              >
                Health Stash
              </Text>
            </View>

            <Image source={require("../../../assets/logo2.png")} />
          </View>
          <View style={{ marginTop: 80 }}>
            <CustomTextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Nome completo"
              icon="account"
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <CustomTextInput
                value={birthdate}
                onChangeText={(text) => setBirthdate(text)}
                placeholder="Data de nascimento"
                icon="calendar"
                width={220}
              />
              <CustomTextInput
                value={gender}
                onChangeText={(text) => setGender(text)}
                placeholder="Gênero"
                icon="gender-male-female"
                width={140}
              />
            </View>

            <CustomTextInput
              value={alergias}
              onChangeText={(text) => setAlergias(text)}
              placeholder="Alergias"
              icon="virus"
            />
            <CustomTextInput
              value={comorbidades}
              onChangeText={(text) => setComorbidades(text)}
              placeholder="Comorbidades"
              icon="note-alert"
            />
            <CustomTextInput
              value={mail}
              onChangeText={(text) => setMail(text)}
              placeholder="E-mail"
              icon="email"
            />
            <CustomTextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder="Senha"
              icon="lock"
              onPress={() => {
                setSecureTextEntry(!secureTextEntry);
                return false;
              }}
              secureTextEntry={secureTextEntry}
            />
          </View>
          <Button
            mode="contained-tonal"
            buttonColor="#FFF"
            textColor="#0083C5"
            style={{
              width: 360,
              borderRadius: 50,
              marginTop: 80,
            }}
            labelStyle={{ fontWeight: 800 }}
            onPress={() => onRegister(mail, password)}
            contentStyle={{ height: 55 }}
          >
            CADASTRAR
          </Button>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
