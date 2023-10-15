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
  postPractitioner,
} from "../../services/api/api.js";
import {
  formatarDataParaBR,
  converterDataParaFormatoISO,
} from "../../utils/date.js";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext/index.js";

const Prescription = ({ patient }) => {
  const { userType } = useContext(AuthenticationContext);

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
  const [prescription, setPrescription] = useState("");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const date = new Date();
  const formattedDate = formatarDataParaBR(date);

  const hour = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const formattedTime = `${hour}:${minutes}`;

  const addPractitioner = async (
    name,
    familyName,
    phone,
    mail,
    especialidade,
    gender,
    birthdate
  ) => {
    const accessToken = await getAuthToken();
    const practitionerData = {
      resourceType: "Practitioner",
      active: true,
      name: [
        {
          family: familyName,
          given: [name],
        },
      ],
      telecom: [
        {
          system: "phone",
          value: phone,
        },
        {
          system: "email",
          value: mail,
        },
      ],
      qualification: [
        {
          code: {
            coding: [
              {
                system: "http://www.nlm.nih.gov/research/umls/rxnorm",
                code: "Physician",
              },
            ],
            text: especialidade,
          },
          period: {
            start: "2010-01-01",
          },
        },
      ],
      gender: gender.toLowerCase() == "masculino" ? "male" : "female",
      birthDate: converterDataParaFormatoISO(birthdate),
      address: [
        {
          use: "home",
          line: ["534 Erewhon St"],
          city: "PleasantVille",
          state: "Vic",
          postalCode: "3999",
        },
      ],
    };
    await postPractitioner(accessToken, practitionerData);
    const result = await getPractitioners(accessToken);
    setPractitioners(result);
    hideModal();
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
                {patient.resource.name[0].given.join(" ")}{" "}
                {patient.resource.name[0].family}
              </Text>
            </Surface>
          </View>
          <View style={styles.information}>
            <View flex={0.48}>
              <Text variant="labelLarge">Data de nascimento</Text>
              <Surface style={styles.surface}>
                <Text>{formatarDataParaBR(patient.resource.birthDate)}</Text>
              </Surface>
            </View>
            <View flex={0.48}>
              <Text variant="labelLarge">Gênero</Text>
              <Surface style={styles.surface}>
                <Text>
                  {patient.resource.gender === "male"
                    ? "Masculino"
                    : "Feminino"}
                </Text>
              </Surface>
            </View>
          </View>
          <View style={styles.label}>
            <Text variant="labelLarge">Prescrição</Text>
            <Surface elevation={5} style={styles.textArea}>
              <TextInput
                multiline={true}
                numberOfLines={10}
                onChangeText={setPrescription}
                value={prescription}
                height={200}
                placeholder="Digite aqui a prescrição do paciente"
              />
            </Surface>
          </View>

          <Button
            mode="elevated"
            onPress={() => hideModal()}
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
