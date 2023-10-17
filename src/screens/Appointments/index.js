import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  IconButton,
  Modal,
  PaperProvider,
  Portal,
} from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";
import {
  getAppointments,
  getAuthToken,
  getPatientById,
  getPractitionerById,
} from "../../services/api/api";
import { formatarDataHoraParaBR, formatarDataParaBR } from "../../utils/date";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";
import Prescription from "../Prescription";
import Condition from "../Condition";

const Appointments = ({ navigation }) => {
  const { userType, userData } = useContext(AuthenticationContext);

  const [appointments, setAppointments] = useState();
  const [todayAppointments, setTodayAppointments] = useState();
  const [scheduledAppointments, setScheduledAppointments] = useState();
  const [allDoneAppointments, setAllDoneAppointments] = useState();
  const [shouldAddCondition, setShouldAddCondition] = useState(false);
  const [shouldAddPrescription, setShouldAddPrescription] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAuthToken();
      if (accessToken) {
        const result = await getAppointments(accessToken);
        const appointmentsFiltered = result.entry
          .map((entry) => entry.resource)
          .filter((appointment) => {
            if (
              appointment.resourceType === "Appointment" &&
              Array.isArray(appointment.participant)
            ) {
              return appointment.participant.some((participant) => {
                const participantId = participant.actor.reference.split("/")[1];
                return userType === "patient"
                  ? participantId === userData.id
                  : participantId === userData.id;
              });
            }
            return false;
          });

        const consultasComDadosDoMedico = await Promise.all(
          appointmentsFiltered.map(async (appointment) => {
            const practitionerId = appointment.participant
              .find((participant) =>
                participant.actor.reference.startsWith("Practitioner/")
              )
              ?.actor.reference.split("/")[1];

            const patientId = appointment.participant
              .find((participant) =>
                participant.actor.reference.startsWith("Patient/")
              )
              ?.actor.reference.split("/")[1];

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

        const dataAtual = new Date();
        const todayAppointments = [];
        const allDoneAppointments = [];
        const scheduledAppointments = [];

        consultasComDadosDoMedico.forEach((item) => {
          const dataAgendada = new Date(item.dataHoraAgendada);

          if (
            dataAgendada.getDate() === dataAtual.getDate() &&
            dataAgendada.getMonth() === dataAtual.getMonth() &&
            dataAgendada.getFullYear() === dataAtual.getFullYear()
          ) {
            todayAppointments.push(item);
          } else if (dataAgendada < dataAtual) {
            allDoneAppointments.push(item);
          } else {
            scheduledAppointments.push(item);
          }
        });

        todayAppointments.sort((a, b) => {
          const horaA = new Date(a.dataHoraAgendada).getTime();
          const horaB = new Date(b.dataHoraAgendada).getTime();
          return horaA - horaB;
        });

        allDoneAppointments.sort((a, b) => {
          const dataA = new Date(a.dataHoraAgendada).getTime();
          const dataB = new Date(b.dataHoraAgendada).getTime();
          return dataB - dataA;
        });

        scheduledAppointments.sort((a, b) => {
          const dataA = new Date(a.dataHoraAgendada).getTime();
          const dataB = new Date(b.dataHoraAgendada).getTime();
          return dataA - dataB;
        });

        setAppointments(consultasComDadosDoMedico);
        setTodayAppointments(todayAppointments);
        setAllDoneAppointments(allDoneAppointments);
        setScheduledAppointments(scheduledAppointments);
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
              {shouldAddPrescription && (
                <Prescription
                  appointment={selectedAppointment}
                  closeModal={hideModal}
                />
              )}
              {shouldAddCondition && (
                <Condition
                  appointment={selectedAppointment}
                  closeModal={hideModal}
                />
              )}
            </>
          </Modal>
        </Portal>
        <View style={styles.container}>
          <View style={styles.scrollContainer}>
            <StatusBar style="light" />
            <View style={styles.header}>
              <Text style={styles.title}>Health Stash</Text>
              <Image
                source={require("../../../assets/logo.png")}
                style={styles.image}
              />
            </View>
            {todayAppointments?.length === 0 && (
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
            {todayAppointments?.length > 0 && (
              <>
                <Text style={styles.subtitle}>Consultas do dia</Text>
                <Text style={styles.quantity}>
                  Quantidade de pacientes: {todayAppointments.length}
                </Text>

                <ScrollView
                  horizontal={true}
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                >
                  {todayAppointments?.map((appointment, index) => (
                    <Card key={index} style={styles.card}>
                      <Badge style={{ margin: 8, backgroundColor: "#004460" }}>
                        {index + 1}
                      </Badge>
                      <Card.Content style={{ marginTop: -30, marginBottom: 8 }}>
                        <Text style={styles.appointmentDate}>
                          {formatarDataHoraParaBR(
                            appointment?.dataHoraAgendada
                          )}
                        </Text>

                        {userType === "patient" && (
                          <>
                            <Text>
                              Médico: {appointment?.medico.name[0].given[0]}{" "}
                              {appointment?.medico.name[0].family}
                            </Text>
                            <Text>
                              Especialidade:{" "}
                              {appointment?.medico.qualification[0].code.text}
                            </Text>
                            <Text>
                              Telefone: {appointment?.medico.telecom[0].value}
                            </Text>
                          </>
                        )}
                        {userType === "practitioner" && (
                          <>
                            <Text style={styles.description}>
                              Paciente:{" "}
                              {appointment?.paciente.name[0].given.join(" ")}{" "}
                              {appointment?.paciente.name[0].family}
                            </Text>
                            <Text>Motivo: {appointment?.motivo}</Text>
                            <Text>
                              Data de nascimento:{" "}
                              {formatarDataParaBR(
                                appointment?.paciente.birthDate
                              )}
                            </Text>
                            <Text>
                              Telefone: {appointment?.paciente.telecom[0].value}
                            </Text>
                          </>
                        )}
                      </Card.Content>
                      {userType !== "patient" && (
                        <Card.Actions>
                          <Button
                            style={{
                              backgroundColor: "#004460",
                              borderWidth: 0,
                            }}
                            theme={{ colors: { primary: "#fff" } }}
                            onPress={() => {
                              setSelectedAppointment(appointment);
                              setShouldAddCondition(true);
                              setShouldAddPrescription(false);
                              showModal();
                            }}
                          >
                            Diagnóstico
                          </Button>
                          <Button
                            style={{ backgroundColor: "#004460" }}
                            theme={{ colors: { primary: "#fff" } }}
                            onPress={() => {
                              setSelectedAppointment(appointment);
                              setShouldAddCondition(false);
                              setShouldAddPrescription(true);
                              showModal();
                            }}
                          >
                            Prescrição
                          </Button>
                        </Card.Actions>
                      )}
                    </Card>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
          <View
            style={{
              alignItems: "flex-start",
              justifyContent: "center",
              width: "100%",
              flex: 1,
              marginHorizontal: 16,
            }}
          >
            {userType === "practitioner" && (
              <>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Consultas agendadas", {
                      scheduledAppointments,
                    })
                  }
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    variant="labelLarge"
                    style={{ fontFamily: "poppins-regular", color: "#fff" }}
                  >
                    Consultas agendadas
                  </Text>
                  <Avatar.Icon
                    icon="chevron-right"
                    color="pink"
                    backgroundColor="transparent"
                    size={48}
                    style={{ marginLeft: -12 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Consultas realizadas", {
                      allDoneAppointments,
                    })
                  }
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    variant="labelLarge"
                    style={{ fontFamily: "poppins-regular", color: "#fff" }}
                  >
                    Consultas realizadas
                  </Text>
                  <Avatar.Icon
                    icon="chevron-right"
                    color="pink"
                    backgroundColor="transparent"
                    size={48}
                    style={{ marginLeft: -12 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    userType === "patient"
                      ? navigation.navigate("Médicos")
                      : userType === "practitioner"
                      ? navigation.navigate("Pacientes")
                      : showModal()
                  }
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text
                    variant="labelLarge"
                    style={{ fontFamily: "poppins-regular", color: "#fff" }}
                  >
                    {userType === "practitioner"
                      ? "Agendar retorno para pacientes"
                      : "Agendar consulta"}
                  </Text>
                  <Avatar.Icon
                    icon="chevron-right"
                    color="pink"
                    backgroundColor="transparent"
                    size={48}
                    style={{ marginLeft: -12 }}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
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
    fontSize: 30,
    color: "white",
    marginBottom: 50,
    textAlign: "center",
    fontWeight: "bold",
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    width: 358,
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
  quantity: {
    marginBottom: 24,
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "poppins-regular",
  },
});

export default Appointments;
