import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Modal,
  PaperProvider,
  Portal,
  TextInput,
  Title,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";
import { getAuthToken, getPatients, postPatient } from "../../services/api/api";

const Patients = ({ navigation }) => {
  const [patients, setPatients] = useState();

  function formatarDataParaBR(data) {
    const dataFormatada = new Date(data);
    const opcoes = { year: "numeric", month: "2-digit", day: "2-digit" };
    return dataFormatada.toLocaleDateString("pt-BR", opcoes);
  }

  function converterDataParaFormatoISO(data) {
    const partes = data.split("/");
    if (partes.length === 3) {
      const dia = partes[0];
      const mes = partes[1];
      const ano = partes[2];

      const dataFormatada = `${ano}-${mes}-${dia}`;

      return dataFormatada;
    } else {
      return "Data inválida";
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAuthToken();
      if (accessToken) {
        const result = await getPatients(accessToken);
        setPatients(result);
      }
    };

    fetchData();
  }, []);

  const [visible, setVisible] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddredss] = useState("");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    margin: 10,
    height: 680,
  };

  const addPatient = async (
    firstName,
    middleName,
    lastName,
    gender,
    birthdate
  ) => {
    const accessToken = await getAuthToken();
    const patientData = {
      resourceType: "Patient",
      active: true,
      name: [
        {
          use: "official",
          family: lastName,
          given: [firstName, middleName],
        },
      ],
      telecom: [
        {
          system: "phone",
          value: "(11) 99988-7766",
          use: "mobile",
          rank: 1,
        },
      ],
      gender: gender.toLowerCase() == "masculino" ? "male" : "female",
      birthDate: converterDataParaFormatoISO(birthdate),
      address: [
        {
          use: "home",
          type: "both",
          text: "534 Erewhon St PeasantVille, Rainbow, Vic  3999",
          line: ["534 Erewhon St"],
          city: "PleasantVille",
          district: "Rainbow",
          state: "Vic",
          postalCode: "3999",
          period: {
            start: "1974-12-25",
          },
        },
      ],
    };
    await postPatient(accessToken, patientData);
    const result = await getPatients(accessToken);
    setPatients(result);
    hideModal();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <PaperProvider>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}
          >
            <Title
              style={{
                textAlign: "center",
                marginBottom: 24,
                fontWeight: "bold",
                fontSize: 24,
              }}
            >
              Adicionar um paciente
            </Title>
            <TextInput
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              placeholder="Nome"
              mode="outlined"
              style={{ marginBottom: 12 }}
            />
            <TextInput
              value={middleName}
              onChangeText={(text) => setMiddleName(text)}
              placeholder="Primeiro sobrenome"
              mode="outlined"
              style={{ marginBottom: 12 }}
            />
            <TextInput
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              placeholder="Último sobrenome"
              mode="outlined"
              style={{ marginBottom: 12 }}
            />
            <TextInput
              value={birthdate}
              onChangeText={(text) => setBirthdate(text)}
              placeholder="Data de nascimento"
              mode="outlined"
              style={{ marginBottom: 12 }}
            />
            <TextInput
              value={gender}
              onChangeText={(text) => setGender(text)}
              placeholder="Gênero"
              mode="outlined"
              style={{ marginBottom: 12 }}
            />
            <TextInput
              value={address}
              onChangeText={(text) => setAddredss(text)}
              placeholder="Endereço"
              mode="outlined"
              style={{ marginBottom: 12 }}
            />
            <Button
              mode="elevated"
              onPress={() =>
                addPatient(firstName, middleName, lastName, gender, birthdate)
              }
              style={styles.addButton}
              textColor="#004460"
            >
              Adicionar
            </Button>
          </Modal>
        </Portal>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <StatusBar style="light" />
            <View style={styles.header}>
              <Text style={styles.title}>HealthStash</Text>
              <Image
                source={require("../../../assets/logo.png")}
                style={styles.image}
              />
            </View>
            <Text style={styles.subtitle}>Pacientes</Text>

            {patients &&
              patients.entry.slice(4).map((patient, index) => (
                <Card key={index} style={styles.card}>
                  <Card.Content>
                    <Text style={styles.patientName}>
                      {patient.resource.name[0].given.join(" ")}{" "}
                      {patient.resource.name[0].family}
                    </Text>
                    <Text>
                      Data de nascimento:{" "}
                      {formatarDataParaBR(patient.resource.birthDate)}
                    </Text>
                    <Text>
                      Gênero:{" "}
                      {patient.resource.gender === "male"
                        ? "Masculino"
                        : "Feminino"}
                    </Text>
                  </Card.Content>
                </Card>
              ))}
          </ScrollView>

          <Button
            mode="contained"
            onPress={showModal}
            style={styles.addButton}
            textColor="#004460"
          >
            Adicionar Paciente
          </Button>
        </View>
      </PaperProvider>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0083C5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  image: {
    resizeMode: "contain",
    justifyContent: "center",
    width: "35%",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 32,
    color: "white",
    marginBottom: 40,
    textAlign: "center",
    fontWeight: "bold",
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    margin: 16,
    backgroundColor: "white",
  },
});

export default Patients;
