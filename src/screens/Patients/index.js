import {
  Image,
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
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { getAuthToken, getPatients } from "../../services/api/api";
import { formatarDataParaBR } from "../../utils/date";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";
import Schedule from "../Schedule";
import NewPatient from "../NewPatient";

const Patients = () => {
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
  }, [patients]);

  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    margin: 10,
    height: 700,
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
                <IconButton
                  icon="close"
                  iconColor="black"
                  size={20}
                  onPress={() => hideModal()}
                  style={{ position: "absolute", top: 0, right: 0 }}
                />
                <NewPatient closeModal={hideModal} />
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
