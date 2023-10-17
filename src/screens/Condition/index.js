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
  postCondition,
  postPractitioner,
} from "../../services/api/api.js";
import {
  formatarDataParaBR,
  converterDataParaFormatoISO,
} from "../../utils/date.js";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext/index.js";

const Condition = ({ appointment, closeModal }) => {
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAuthToken();
      if (accessToken) {
        const result = await getPractitioners(accessToken);
        setPractitioners(result);
      }
    };

    fetchData();
  }, []);
  const [practitioners, setPractitioners] = useState();

  const [visible, setVisible] = useState(false);
  const [description, setDescription] = useState("");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const date = new Date();
  const formattedDate = formatarDataParaBR(date);

  const hour = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const formattedTime = `${hour}:${minutes}`;

  const addCondition = async (patientId, practitionerId, description) => {
    const accessToken = await getAuthToken();

    const conditionData = {
      resourceType: "Condition",
      id: "example",
      text: {
        status: "generated",
        div: "<div>Severe burn of left ear (Date: 24-May 2012)</div>",
      },
      clinicalStatus: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
            code: "active",
          },
        ],
      },
      verificationStatus: {
        coding: [
          {
            system:
              "http://terminology.hl7.org/CodeSystem/condition-ver-status",
            code: "confirmed",
          },
        ],
      },
      category: [
        {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/condition-category",
              code: "encounter-diagnosis",
              display: "Encounter Diagnosis",
            },
          ],
        },
      ],
      code: {
        text: description,
      },
      subject: {
        reference: `Patient/${patientId}`,
      },
      onsetString: `Practitioner/${practitionerId}`,
    };
    await postCondition(accessToken, conditionData);
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
          <Title style={styles.title}>Diagnóstico do paciente</Title>
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
            <Text variant="labelLarge">Diagnóstico</Text>
            <Surface elevation={5} style={styles.textArea}>
              <TextInput
                multiline={true}
                numberOfLines={10}
                onChangeText={setDescription}
                value={description}
                height={150}
                placeholder="Digite aqui o diagnóstico do paciente"
              />
            </Surface>
          </View>

          <Button
            mode="elevated"
            onPress={() => {
              addCondition(
                appointment.paciente.id,
                appointment.medico.id,
                description
              );
              closeModal();
            }}
            style={styles.addButton}
            textColor="#004460"
          >
            Enviar diagnóstico
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
    paddingTop: 0,
    height: 170,
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

export default Condition;
