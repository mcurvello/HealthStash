import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Button, Surface, Title, Text } from "react-native-paper";
import { Image } from "react-native";
import {
  getAuthToken,
  getPractitioners,
  postAppointment,
} from "../../services/api/api.js";
import {
  formatarDataParaBR,
  converterDataParaFormatoISO,
  converterDataHoraParaISO,
  endDateParaISO,
} from "../../utils/date.js";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext/index.js";

const Schedule = ({ patient, practitioner }) => {
  const [practitioners, setPractitioners] = useState();
  const [date, setDate] = useState();
  const [time, setTime] = useState();

  const [visible, setVisible] = useState(false);
  const [description, setDescription] = useState("");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const addAppointment = async (
    patientId,
    practitionerId,
    description,
    date,
    time
  ) => {
    const startDate = converterDataHoraParaISO(date, time);
    const endDate = converterDataHoraParaISO(date, time);

    const accessToken = await getAuthToken();

    const appointmentData = {
      resourceType: "Appointment",
      status: "booked",
      description: description,
      start: startDate,
      end: endDate,
      participant: [
        {
          actor: {
            reference: "Patient/" + patientId,
          },
          status: "accepted",
        },
        {
          actor: {
            reference: "Practitioner/" + practitionerId,
          },
          status: "accepted",
        },
      ],
    };
    await postAppointment(accessToken, appointmentData);
    const result = await getPractitioners(accessToken);
    setPractitioners(result);
    hideModal();
  };
  console.log(practitioner);
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
          <Title style={styles.title}>Agendamento de consulta</Title>
          <View style={styles.information}>
            <View flex={0.48}>
              <Text variant="labelLarge">Data</Text>
              <Surface style={styles.surface}>
                <TextInput
                  onChangeText={setDate}
                  value={date}
                  placeholder="dd/mm/aaaa"
                />
              </Surface>
            </View>
            <View flex={0.48}>
              <Text variant="labelLarge">Hora</Text>
              <Surface style={styles.surface}>
                <TextInput
                  onChangeText={setTime}
                  value={time}
                  placeholder="HH:MM"
                />
              </Surface>
            </View>
          </View>
          <View style={styles.label}>
            <Text variant="labelLarge">Médico</Text>
            <Surface style={styles.surface}>
              <Text>
                {practitioner.resource.name[0].given.join(" ")}{" "}
                {practitioner.resource.name[0].family}
              </Text>
            </Surface>
          </View>
          <View style={styles.label}>
            <Text variant="labelLarge">Especialidade</Text>
            <Surface style={styles.surface}>
              <Text>{practitioner.resource.qualification[0].code.text}</Text>
            </Surface>
          </View>
          <View style={styles.label}>
            <Text variant="labelLarge">Paciente</Text>
            <Surface style={styles.surface}>
              <Text>
                {patient.name[0].given.join(" ")} {patient.name[0].family}
              </Text>
            </Surface>
          </View>

          <View style={styles.label}>
            <Text variant="labelLarge">Motivo</Text>
            <Surface elevation={5} style={styles.textArea}>
              <TextInput
                multiline={true}
                numberOfLines={4}
                onChangeText={setDescription}
                value={description}
                height={120}
                placeholder="Digite aqui o motivo da consulta"
              />
            </Surface>
          </View>

          <Button
            mode="elevated"
            onPress={() =>
              addAppointment(
                patient.id,
                practitioner.resource.id,
                description,
                date,
                time
              )
            }
            style={styles.addButton}
            textColor="#004460"
          >
            Agendar consulta
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

export default Schedule;
