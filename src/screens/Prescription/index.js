import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { Button, Surface, Title, Text } from "react-native-paper";
import { Image } from "react-native";
import { getAuthToken, postMedicationRequest } from "../../services/api/api.js";
import { formatarDataParaBR } from "../../utils/date.js";

const Prescription = ({ appointment, closeModal }) => {
  const [medication, setMedication] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState();

  const date = new Date();
  const formattedDate = formatarDataParaBR(date);

  const hour = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const formattedTime = `${hour}:${minutes}`;

  const addPrescription = async (
    patientId,
    patientName,
    practitionerId,
    practitionerName,
    type,
    quantity,
    medication
  ) => {
    const accessToken = await getAuthToken();

    const prescriptionData = {
      resourceType: "MedicationRequest",
      status: "stopped",
      intent: "order",
      priority: "routine",
      medicationCodeableConcept: {
        id: "865fceb1-ad0c-4102-aead-26ca25c77b09",
        coding: [
          {
            system: "http://openmrs.org",
            code: "cedf8fc4–6fc9–11e7–9b2b-c4d98716fd91",
            display: medication,
          },
        ],
      },
      subject: {
        id: patientId,
        reference: `Patient/${patientId}`,
        display: patientName,
      },

      recorder: {
        id: practitionerId,
        reference: `Practitioner/${practitionerId}`,
        display: practitionerName,
      },
      dispenseRequest: {
        quantity: {
          value: Number(quantity),
          unit: type,
        },
      },
    };
    await postMedicationRequest(accessToken, prescriptionData);
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
          <Title style={styles.title}>Prescrição do paciente</Title>
          <View style={styles.information}>
            <View flex={0.48}>
              <Text variant="labelLarge">Data</Text>
              <Surface style={styles.surface}>
                <Text>{formattedDate}</Text>
              </Surface>
            </View>
            <View flex={0.48}>
              <Text variant="labelLarge">Hora</Text>
              <Surface style={styles.surface}>
                <Text>{formattedTime}</Text>
              </Surface>
            </View>
          </View>
          <View style={styles.label}>
            <Text variant="labelLarge">Paciente</Text>
            <Surface style={styles.surface}>
              <Text>
                {appointment.paciente.name[0].given.join(" ")}{" "}
                {appointment.paciente.name[0].family}
              </Text>
            </Surface>
          </View>

          <View style={styles.label}>
            <Text variant="labelLarge">Medicamento</Text>
            <Surface elevation={5} style={styles.surface}>
              <TextInput
                onChangeText={setMedication}
                value={medication}
                placeholder="Digite aqui um medicamento para o paciente"
              />
            </Surface>
          </View>
          <View style={styles.label}>
            <Text variant="labelLarge">Tipo do medicamento</Text>
            <Surface elevation={5} style={styles.surface}>
              <TextInput
                onChangeText={setType}
                value={type}
                placeholder="Digite aqui o tipo: comprimido, gotas, etc."
              />
            </Surface>
          </View>
          <View style={styles.label}>
            <Text variant="labelLarge">Quantidade</Text>
            <Surface elevation={5} style={styles.surface}>
              <TextInput
                onChangeText={setQuantity}
                value={quantity}
                placeholder="Digite aqui a quantidade"
              />
            </Surface>
          </View>
          <Button
            mode="elevated"
            onPress={() => {
              addPrescription(
                appointment.paciente.id,
                appointment.paciente.name[0].given.join(" ") +
                  " " +
                  appointment.paciente.name[0].family,
                appointment.medico.id,
                appointment.medico.name[0].given.join(" ") +
                  " " +
                  appointment.medico.name[0].family,
                type,
                quantity,
                medication
              );

              closeModal();
            }}
            style={styles.addButton}
            textColor="#004460"
          >
            Enviar prescrição
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
    marginTop: 24,
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
    height: 180,
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

export default Prescription;
