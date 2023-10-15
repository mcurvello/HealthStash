import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
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
  getAuthToken,
  getPractitioners,
  postPractitioner,
} from "../../services/api/api.js";
import {
  formatarDataParaBR,
  converterDataParaFormatoISO,
} from "../../utils/date.js";
import CustomTextInput from "../../components/CustomTextInput/index.js";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext/index.js";

const Practitioners = () => {
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
  const [name, setName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [phone, setPhone] = useState("");
  const [mail, setMail] = useState("");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [patients, setPatients] = useState([
    { id: 1, name: "Maria", age: 35, gender: "Feminino" },
    { id: 2, name: "João", age: 45, gender: "Masculino" },
    { id: 3, name: "Ana", age: 28, gender: "Feminino" },
  ]);

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
    <PaperProvider>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}
        >
          <Image
            style={{ width: "20%", height: "10%" }}
            resizeMode="contain"
            resizeMethod="scale"
            source={require("../../../assets/logo2.png")}
          />
          <Title
            style={{
              textAlign: "center",
              marginBottom: 24,
              fontWeight: "bold",
              fontSize: 24,
            }}
          >
            Adicionar um médico
          </Title>

          <CustomTextInput
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Nome"
            width="100%"
            color="#004460"
          />
          <CustomTextInput
            value={familyName}
            onChangeText={(text) => setFamilyName(text)}
            placeholder="Sobrenome"
            width="100%"
            color="#004460"
          />
          <CustomTextInput
            value={birthdate}
            onChangeText={(text) => setBirthdate(text)}
            placeholder="Data de nascimento"
            width="100%"
            color="#004460"
          />
          <CustomTextInput
            value={gender}
            onChangeText={(text) => setGender(text)}
            placeholder="Gênero"
            width="100%"
            color="#004460"
          />
          <CustomTextInput
            value={especialidade}
            onChangeText={(text) => setEspecialidade(text)}
            placeholder="Especialidade"
            width="100%"
            color="#004460"
          />

          <CustomTextInput
            value={phone}
            onChangeText={(text) => setPhone(text)}
            placeholder="Telefone"
            width="100%"
            color="#004460"
          />
          <CustomTextInput
            value={mail}
            onChangeText={(text) => setMail(text)}
            placeholder="E-mail"
            width="100%"
            color="#004460"
          />
          <Button
            mode="elevated"
            onPress={() =>
              addPractitioner(
                name,
                familyName,
                phone,
                mail,
                especialidade,
                gender,
                birthdate
              )
            }
            style={styles.addButton}
            textColor="#004460"
          >
            Adicionar
          </Button>
        </Modal>
      </Portal>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <StatusBar style="light" />
          <View style={styles.header}>
            <Text style={styles.title}>HealthStash</Text>
            <Image
              source={require("../../../assets/logo.png")}
              style={styles.image}
            />
          </View>
          <Text style={styles.subtitle}>Médicos</Text>

          {practitioners &&
            practitioners.entry.map((practitioner, index) => (
              <Card key={index} style={styles.card}>
                <Badge theme={{ colors: { error: "green" } }}>Agendado</Badge>
                <Card.Content>
                  <Text style={styles.practitionerName}>
                    {practitioner.resource.name[0].given.join(" ")}{" "}
                    {practitioner.resource.name[0].family}
                  </Text>
                  <Text style={styles.qualification}>
                    {practitioner.resource.qualification[0].code.text}
                  </Text>
                  <Text>
                    Data de nascimento:{" "}
                    {formatarDataParaBR(practitioner.resource.birthDate)}
                  </Text>
                  <Text style={styles.gender}>
                    Gênero:{" "}
                    {practitioner.resource.gender === "male"
                      ? "Masculino"
                      : "Feminino"}
                  </Text>
                  <Text>
                    Telefone: {practitioner.resource.telecom[0].value}
                  </Text>
                  <Text>E-mail: {practitioner.resource.telecom[1].value}</Text>
                </Card.Content>
              </Card>
            ))}
        </ScrollView>

        {userType === "clinic" && (
          <Button
            mode="contained"
            onPress={showModal}
            style={styles.addButton}
            textColor="#004460"
          >
            Adicionar Médico
          </Button>
        )}
      </View>
    </PaperProvider>
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
  practitionerName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  qualification: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  gender: {
    marginBottom: 8,
  },
  addButton: {
    margin: 16,
    backgroundColor: "white",
  },
  modalTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  containerStyle: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    margin: 10,
    height: 680,
    width: "auto",
    alignItems: "center",
  },
});

export default Practitioners;
