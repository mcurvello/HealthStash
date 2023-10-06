import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
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
import { getAuthToken } from "../../services/api/api.js";

const Practitioners = () => {
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAuthToken();
      if (accessToken) {
        // Use o token para fazer solicitações autenticadas
        // Implemente as chamadas de função apropriadas aqui
      }
    };

    fetchData();
  }, []);

  const [visible, setVisible] = useState(false);
  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [gender, setGender] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [address, setAddredss] = useState("");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    margin: 10,
    height: 680,
  };

  const [patients, setPatients] = useState([
    { id: 1, name: "Maria", age: 35, gender: "Feminino" },
    { id: 2, name: "João", age: 45, gender: "Masculino" },
    { id: 3, name: "Ana", age: 28, gender: "Feminino" },
  ]);

  const addPatient = () => {
    // Simulação de adição de paciente, você pode implementar a lógica real aqui
    const newPatient = {
      id: patients.length + 1,
      name: "Novo Paciente",
      age: 0,
      gender: "Indefinido",
    };
    setPatients([...patients, newPatient]);
  };

  return (
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
            Adicionar um médico
          </Title>
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            placeholder="Nome completo"
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
            value={especialidade}
            onChangeText={(text) => setEspecialidade(text)}
            placeholder="Especialidade"
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
            onPress={showModal}
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

          {patients.map((patient) => (
            <Card key={patient.id} style={styles.card}>
              <Card.Content>
                <Text style={styles.patientName}>{patient.name}</Text>
                <Text>Idade: {patient.age} anos</Text>
                <Text>Gênero: {patient.gender}</Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        <Button
          mode="contained"
          onPress={showModal}
          style={styles.addButton}
          textColor="#004460"
        >
          Adicionar Médico
        </Button>
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
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    margin: 16,
    backgroundColor: "white",
  },
});

export default Practitioners;
