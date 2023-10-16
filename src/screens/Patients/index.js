import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  IconButton,
  Modal,
  PaperProvider,
  Portal,
  TextInput,
  Title,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";
import { getAuthToken, getPatients, postPatient } from "../../services/api/api";
import {
  formatarDataParaBR,
  converterDataParaFormatoISO,
} from "../../utils/date";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";
import { Map } from "../Map";
import Prescription from "../Prescription";
import Schedule from "../Schedule";

const Patients = ({ navigation }) => {
  const [patients, setPatients] = useState();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [shouldAddPatient, setShouldAddPatient] = useState(false);
  const { userType, userData } = useContext(AuthenticationContext);

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
    height: 700,
  };

  const addPatient = async (
    firstName,
    middleName,
    lastName,
    gender,
    birthdate,
    address
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
        {
          system: "email",
          value: "joao@teste.com",
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
            {shouldAddPatient && (
              <>
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
                    addPatient(
                      firstName,
                      middleName,
                      lastName,
                      gender,
                      birthdate,
                      address
                    )
                  }
                  style={styles.addButton}
                  textColor="#004460"
                >
                  Adicionar
                </Button>
              </>
            )}
            {!shouldAddPatient && userType === "practitioner" && (
              <>
                <IconButton
                  icon="close"
                  iconColor="black"
                  size={20}
                  onPress={() => hideModal()}
                  style={{ position: "absolute", top: 0, right: 0 }}
                />
                <Schedule
                  patient={selectedPatient}
                  practitioner={userData}
                  closeModal={hideModal}
                />
              </>
            )}
          </Modal>
        </Portal>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <StatusBar style="light" />
            <View style={styles.header}>
              <Text style={styles.title}>Health Stash</Text>
              <Image
                source={require("../../../assets/logo.png")}
                style={styles.image}
              />
            </View>
            <Text style={styles.subtitle}>Pacientes</Text>

            {patients &&
              patients.entry.map((patient, index) => (
                <Card
                  key={index}
                  style={styles.card}
                  onPress={() => {
                    setShouldAddPatient(false);
                    setSelectedPatient(patient);
                    showModal();
                  }}
                >
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

          {userType !== "patient" && (
            <Button
              mode="contained"
              onPress={() => {
                setShouldAddPatient(true);
                showModal();
              }}
              style={styles.addButton}
              textColor="#004460"
            >
              Adicionar Paciente
            </Button>
          )}
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
    fontFamily: "poppins-bold",
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontFamily: "poppins-bold",
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
