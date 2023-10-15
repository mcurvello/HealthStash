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
  getPatients,
  getPractitionerById,
  postPatient,
} from "../../services/api/api";
import {
  formatarDataParaBR,
  converterDataParaFormatoISO,
  formatarDataHoraParaBR,
} from "../../utils/date";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";

const Prescriptions = ({ navigation }) => {
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
                return participant.actor.reference === `Patient/${userData.id}`;
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

            if (practitionerId) {
              console.log(practitionerId);
              const practitioner = await getPractitionerById(
                accessToken,
                practitionerId
              );
              return {
                dataHoraAgendada: appointment.start,
                medico: practitioner,
              };
            }

            return null;
          })
        );

        setAppointments(consultasComDadosDoMedico);
      }
    };

    fetchData();
  }, []);

  console.log(appointments);
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
                <Text style={styles.subtitle}>Prescrições médicas</Text>
                {appointments.map((appointment, index) => (
                  <Card
                    key={index}
                    style={styles.card}
                    onPress={() => navigation.navigate("Buscar")}
                  >
                    <Card.Content>
                      <Text style={styles.appointmentDate}>
                        {formatarDataHoraParaBR(appointment.dataHoraAgendada)}
                      </Text>

                      <Text>
                        Médico: {appointment.medico.name[0].given[0]}{" "}
                        {appointment.medico.name[0].family}
                      </Text>
                      <Text>
                        Especialidade:{" "}
                        {appointment.medico.qualification[0].code.text}
                      </Text>
                    </Card.Content>
                  </Card>
                ))}
              </>
            )}
          </ScrollView>
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
});

export default Prescriptions;
