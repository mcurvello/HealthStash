import React, { useContext, useState } from "react";
import { Container } from "./styles";
import { Button, Text } from "react-native-paper";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";
import CustomTextInput from "../../components/CustomTextInput";
import { converterDataParaFormatoISO } from "../../utils/date";
import { getAuthToken, postPatient } from "../../services/api/api";

export const Patient = ({ route }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");

  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const { phone } = route.params;

  const { onRegister, setUserData } = useContext(AuthenticationContext);

  const addPatient = async (
    firstName,
    lastName,
    phone,
    gender,
    birthdate,
    address,
    mail
  ) => {
    const accessToken = await getAuthToken();
    const patientData = {
      resourceType: "Patient",
      active: true,
      name: [
        {
          use: "official",
          family: lastName,
          given: [firstName],
        },
      ],
      telecom: [
        {
          system: "phone",
          value: phone,
          use: "mobile",
          rank: 1,
        },
        {
          system: "email",
          value: mail,
        },
      ],
      gender: gender.toLowerCase() == "masculino" ? "male" : "female",
      birthDate: converterDataParaFormatoISO(birthdate),
      address: [
        {
          use: "home",
          type: "both",
          text: address,
        },
      ],
    };
    const id = await postPatient(accessToken, patientData);

    setUserData({
      ...patientData,
      id: id,
    });
  };

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
          <View style={{ marginTop: 20 }}>
            <CustomTextInput
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              placeholder="Nome"
              icon="account"
            />
            <CustomTextInput
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              placeholder="Sobrenome"
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
                placeholder="Nascimento"
                icon="calendar"
                width={210}
              />
              <CustomTextInput
                value={gender}
                onChangeText={(text) => setGender(text)}
                placeholder="Gênero"
                icon="gender-male-female"
                width={150}
              />
            </View>
            <CustomTextInput
              value={address}
              onChangeText={(text) => setAddress(text)}
              placeholder="Endereço"
              icon="virus"
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
            onPress={() => {
              addPatient(
                firstName,
                lastName,
                phone,
                gender,
                birthdate,
                address,
                mail
              );
              onRegister(mail, password);
            }}
            contentStyle={{ height: 55 }}
          >
            CADASTRAR
          </Button>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
