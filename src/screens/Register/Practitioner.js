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
import { getAuthToken, postPractitioner } from "../../services/api/api";
import { converterDataParaFormatoISO } from "../../utils/date";

export const Practitioner = ({ route }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const { phone } = route.params;

  const { onRegister, setUserData, setUserType } = useContext(
    AuthenticationContext
  );

  const addPractitioner = async (
    firstName,
    lastName,
    phone,
    mail,
    address,
    especialidade,
    gender,
    birthdate
  ) => {
    const accessToken = await getAuthToken();
    const practitionerData = {
      resourceType: "Practitioner",
      active: true,
      name: [
        {
          family: lastName,
          given: [firstName],
        },
      ],
      telecom: [
        {
          system: "phone",
          value: phone,
        },
        {
          system: "email",
          value: mail,
        },
      ],
      qualification: [
        {
          code: {
            coding: [
              {
                system: "http://www.nlm.nih.gov/research/umls/rxnorm",
                code: "Physician",
              },
            ],
            text: especialidade,
          },
          period: {
            start: "2010-01-01",
          },
        },
      ],
      gender: gender.toLowerCase() == "masculino" ? "male" : "female",
      birthDate: converterDataParaFormatoISO(birthdate),
      address: [
        {
          use: "home",
          text: address,
        },
      ],
    };
    console.log(practitionerData);
    const result = await postPractitioner(accessToken, practitionerData);

    setUserData({
      ...practitionerData,
      id: result.id,
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
              marginTop: 30,
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
                Médico
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
                width={200}
              />
              <CustomTextInput
                value={gender}
                onChangeText={(text) => setGender(text)}
                placeholder="Gênero"
                icon="gender-male-female"
                width={160}
              />
            </View>
            <CustomTextInput
              value={address}
              onChangeText={(text) => setAddress(text)}
              placeholder="Endereço"
              icon="virus"
            />
            <CustomTextInput
              value={especialidade}
              onChangeText={(text) => setEspecialidade(text)}
              placeholder="Especialidade"
              icon="note"
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
              marginTop: 110,
            }}
            labelStyle={{ fontWeight: 800 }}
            onPress={() => {
              addPractitioner(
                firstName,
                lastName,
                phone,
                mail,
                address,
                especialidade,
                gender,
                birthdate
              );
              setUserType("practitioner");
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
