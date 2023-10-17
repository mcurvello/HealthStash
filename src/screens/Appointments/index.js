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
import {
  getAppointments,
  getAuthToken,
  getPatientById,
  getPatients,
  getPractitionerById,
  postPatient,
} from "../../services/api/api";
import {
  converterDataParaFormatoISO,
  formatarDataHoraParaBR,
  formatarDataParaBR,
} from "../../utils/date";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";
import Prescription from "../Prescription";

const Appointments = ({ navigation }) => {
  const { userType, userData } = useContext(AuthenticationContext);

  const [patients, setPatients] = useState();
  const [appointments, setAppointments] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAuthToken();
      if (accessToken) {
        const result = await getAppointments(accessToken);

        const appointmentsPatient = result.entry.filter((entry) => {
          const appointment = entry.resource;
          if (appointment.resourceType === "Appointment") {
            if (Array.isArray(appointment.participant)) {
              return appointment.participant.some((participant) => {
                return userType === "patient"
                  ? participant.actor.reference === `Patient/${userData.id}`
                  : participant.actor.reference ===
                      `Practitioner/${userData.id}`;
              });
            }
          }
          return false;
        });

        const consultasComDadosDoMedico = await Promise.all(
          appointmentsPatient.map(async (consulta) => {
            const appointment = consulta.resource;
            const practitionerReference = appointment.participant.find(
              (participant) =>
                participant.actor.reference.startsWith("Practitioner/")
            )?.actor.reference;

            const practitionerId = practitionerReference
              ? practitionerReference.split("/")[1]
              : null;

            const patientReference = appointment.participant.find(
              (participant) =>
                participant.actor.reference.startsWith("Patient/")
            )?.actor.reference;

            const patientId = patientReference
              ? patientReference.split("/")[1]
              : null;

            if (practitionerId && patientId) {
              const practitioner = await getPractitionerById(
                accessToken,
                practitionerId
              );
              const patient = await getPatientById(accessToken, patientId);
              return {
                dataHoraAgendada: appointment.start,
                motivo: appointment.description,
                medico: practitioner,
                paciente: patient,
              };
            }

            return null;
          })
        );

        setAppointments(consultasComDadosDoMedico);
      }
    };

    fetchData();
  }, [appointments]);

  const [visible, setVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState();

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
            <>
              <IconButton
                icon="close"
                iconColor="black"
                size={20}
                onPress={() => hideModal()}
                style={{ position: "absolute", top: 0, right: 0 }}
              />
              <Prescription appointment={selectedAppointment} />
            </>
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
            {!appointments && (
              <View
                style={{
                  marginTop: 120,
                  height: 200,
                  justifyContent: "center",
                }}
              >
                <Text style={styles.subtitle}>
                  Você ainda não possui consultas agendadas
                </Text>
              </View>
            )}
            {appointments && (
              <>
                <Text style={styles.subtitle}>Consultas agendadas</Text>
                {appointments.map((appointment, index) => (
                  <Card
                    key={index}
                    style={styles.card}
                    onPress={
                      userType !== "patient"
                        ? () => {
                            setSelectedAppointment(appointment);
                            showModal();
                          }
                        : null
                    }
                  >
                    <Card.Content>
                      <Text style={styles.appointmentDate}>
                        {formatarDataHoraParaBR(appointment.dataHoraAgendada)}
                      </Text>

                      {userType === "patient" && (
                        <>
                          <Text>
                            Médico: {appointment.medico.name[0].given[0]}{" "}
                            {appointment.medico.name[0].family}
                          </Text>
                          <Text>
                            Especialidade:{" "}
                            {appointment.medico.qualification[0].code.text}
                          </Text>
                          <Text>
                            Telefone: {appointment.medico.telecom[0].value}
                          </Text>
                        </>
                      )}
                      {userType === "practitioner" && (
                        <>
                          <Text style={styles.description}>
                            Paciente:{" "}
                            {appointment.paciente.name[0].given.join(" ")}{" "}
                            {appointment.paciente.name[0].family}
                          </Text>
                          <Text>Motivo: {appointment.motivo}</Text>
                          <Text>
                            Data de nascimento:{" "}
                            {formatarDataParaBR(appointment.paciente.birthDate)}
                          </Text>
                          <Text>
                            Telefone: {appointment.paciente.telecom[0].value}
                          </Text>
                        </>
                      )}
                    </Card.Content>
                  </Card>
                ))}
              </>
            )}
          </ScrollView>

          <Button
            mode="contained"
            onPress={() =>
              userType === "patient"
                ? navigation.navigate("Médicos")
                : userType === "practitioner"
                ? navigation.navigate("Pacientes")
                : showModal()
            }
            style={styles.addButton}
            textColor="#004460"
          >
            {userType === "practitioner"
              ? "Agendar retorno para paciente"
              : "Agendar consulta"}
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
    fontFamily: "poppins-bold",
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontFamily: "poppins-regular",
    fontSize: 24,
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
  appointmentDate: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  addButton: {
    margin: 16,
    backgroundColor: "white",
  },
  description: {
    marginBottom: 12,
    fontFamily: "poppins-bold",
  },
});

export default Appointments;
