import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import React, { useContext, useState } from "react";
import {
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

import { formatarDataHoraParaBR, formatarDataParaBR } from "../../utils/date";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";
import Prescription from "../Prescription";
import Condition from "../Condition";

const AllDoneAppointments = ({ navigation, route }) => {
  const { userType } = useContext(AuthenticationContext);
  const { allDoneAppointments } = route.params;
  const [shouldAddCondition, setShouldAddCondition] = useState(false);
  const [shouldAddPrescription, setShouldAddPrescription] = useState(false);

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
                <Prescription appointment={selectedAppointment} />
              )}
              {shouldAddCondition && (
                <Condition appointment={selectedAppointment} />
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
            {allDoneAppointments.length === 0 && (
              <View
                style={{
                  marginTop: 120,
                  height: 200,
                  justifyContent: "center",
                }}
              >
                <Text style={styles.subtitle}>
                  Você ainda não possui consultas realizadas
                </Text>
              </View>
            )}
            {allDoneAppointments.length > 0 && (
              <>
                <Text style={styles.subtitle}>Consultas realizadas</Text>
                <Text style={styles.quantity}>
                  Quantidade de pacientes: {allDoneAppointments.length}
                </Text>

                <ScrollView
                  style={{ height: "auto" }}
                  showsHorizontalScrollIndicator={false}
                >
                  {allDoneAppointments.map((appointment, index) => (
                    <Card key={index} style={styles.card}>
                      <Badge style={{ margin: 8, backgroundColor: "#004460" }}>
                        {index + 1}
                      </Badge>
                      <Card.Content style={{ marginTop: -30, marginBottom: 8 }}>
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
                              {formatarDataParaBR(
                                appointment.paciente.birthDate
                              )}
                            </Text>
                            <Text>
                              Telefone: {appointment.paciente.telecom[0].value}
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
          ></View>
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
  quantity: {
    marginBottom: 24,
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "poppins-regular",
  },
});

export default AllDoneAppointments;
