import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, Surface, Title, Text } from "react-native-paper";
import { Image } from "react-native";
import {
  getAuthToken,
  getPatients,
  postPatient,
} from "../../services/api/api.js";
import { converterDataParaFormatoISO } from "../../utils/date.js";

const NewPatient = ({ closeModal }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");

  const addPatient = async (
    firstName,
    lastName,
    gender,
    birthdate,
    address,
    phone,
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
    await postPatient(accessToken, patientData);
    await getPatients(accessToken);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Image
            style={{ width: "20%", height: "10%" }}
            resizeMode="contain"
            resizeMethod="scale"
            source={require("../../../assets/logo2.png")}
          />
          <Title style={styles.title}>Adicionar um paciente</Title>
          <View style={styles.label}>
            <Text variant="labelLarge">Nome</Text>
            <Surface style={styles.surface}>
              <TextInput
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
                placeholder="Digite o primeiro nome do paciente"
                mode="outlined"
              />
            </Surface>
          </View>
          <View style={styles.label}>
            <Text variant="labelLarge">Sobrenome</Text>
            <Surface style={styles.surface}>
              <TextInput
                value={lastName}
                onChangeText={(text) => setLastName(text)}
                placeholder="Digite os sobrenomes do paciente"
                mode="outlined"
              />
            </Surface>
          </View>
          <View style={styles.information}>
            <View flex={0.48}>
              <Text variant="labelLarge">Data de nascimento</Text>
              <Surface style={styles.surface}>
                <TextInput
                  onChangeText={setBirthdate}
                  value={birthdate}
                  placeholder="dd/mm/aaaa"
                />
              </Surface>
            </View>
            <View flex={0.48}>
              <Text variant="labelLarge">Gênero</Text>
              <Surface style={styles.surface}>
                <TextInput
                  onChangeText={setGender}
                  value={gender}
                  placeholder="Gênero"
                />
              </Surface>
            </View>
          </View>
          <View style={styles.label}>
            <Text variant="labelLarge">Endereço</Text>
            <Surface style={styles.surface}>
              <TextInput
                value={address}
                onChangeText={(text) => setAddress(text)}
                placeholder="Digite o endereço do paciente"
                mode="outlined"
              />
            </Surface>
          </View>
          <View style={styles.label}>
            <Text variant="labelLarge">Telefone</Text>
            <Surface style={styles.surface}>
              <TextInput
                value={phone}
                onChangeText={(text) => setPhone(text)}
                placeholder="(xx) xxxxx-xxxx"
                mode="outlined"
              />
            </Surface>
          </View>
          <View style={styles.label}>
            <Text variant="labelLarge">E-mail</Text>
            <Surface style={styles.surface}>
              <TextInput
                value={mail}
                onChangeText={(text) => setMail(text)}
                placeholder="Digite o e-mail do paciente"
                mode="outlined"
              />
            </Surface>
          </View>
          <Button
            mode="elevated"
            onPress={() => {
              addPatient(
                firstName,
                lastName,
                gender,
                birthdate,
                address,
                phone,
                mail
              );
              closeModal();
            }}
            style={styles.addButton}
            textColor="#004460"
          >
            Adicionar paciente
          </Button>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  title: {
    textAlign: "center",
    marginBottom: 48,
    fontWeight: "bold",
    fontSize: 24,
  },
  addButton: {
    backgroundColor: "white",
  },
  information: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  surface: {
    padding: 8,
    height: 40,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "white",
    marginBottom: 16,
  },
  textArea: {
    padding: 8,
    paddingTop: 40,
    height: 100,
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    backgroundColor: "white",
    marginBottom: 32,
  },
  label: {
    width: "100%",
  },
});

export default NewPatient;
