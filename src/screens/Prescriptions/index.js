import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { Card, PaperProvider } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";
import { getAuthToken, getMedicationRequest } from "../../services/api/api";
import { formatarDataHoraParaBR, formatarDataParaBR } from "../../utils/date";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";

const Prescriptions = ({ navigation }) => {
  const { userData } = useContext(AuthenticationContext);

  const [prescriptions, setPrescriptions] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAuthToken();
      if (accessToken) {
        const result = await getMedicationRequest(accessToken);

        const patientData = result.entry.filter(
          (entry) => entry.resource.subject.id === userData.id
        );
        const patientInfo = patientData.map((entry) => ({
          medicationRequestId: entry.resource.id,
          date: formatarDataParaBR(entry.resource.meta.lastUpdated),
          medicationName:
            entry.resource.medicationCodeableConcept.coding[0].display,
          status: entry.resource.status,
          recorder: entry.resource.recorder.display,
          dispenseValue: entry.resource.dispenseRequest.quantity.value,
          dispenseUnit: entry.resource.dispenseRequest.quantity.unit,
        }));

        setPrescriptions(patientInfo);
      }
    };

    fetchData();
  }, [prescriptions]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <PaperProvider>
        <View style={styles.container}>
          <StatusBar style="light" />
          <View style={styles.header}>
            <Text style={styles.title}>Health Stash</Text>
            <Image
              source={require("../../../assets/logo.png")}
              style={styles.image}
            />
          </View>
          <Text style={styles.subtitle}>Prescrições médicas</Text>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {prescriptions?.length === 0 && (
              <View
                style={{
                  marginTop: 120,
                  height: 200,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "poppins-regular",
                    textAlign: "center",
                    marginBottom: 24,
                    fontSize: 24,
                    color: "white",
                  }}
                >
                  Você ainda não possui consultas agendadas
                </Text>
              </View>
            )}
            {prescriptions?.length > 0 && (
              <>
                <Text
                  style={{
                    fontFamily: "poppins-regular",
                    textAlign: "center",
                    marginBottom: 24,
                    fontSize: 16,
                    color: "white",
                  }}
                >
                  Para buscar locais para realizar a compra dos medicamentos,
                  pressione a prescrição
                </Text>
                {prescriptions.map((prescription, index) => (
                  <Card
                    key={index}
                    style={styles.card}
                    onPress={() => navigation.navigate("Buscar")}
                  >
                    <Card.Content>
                      <Text style={styles.appointmentDate}>
                        {prescription.date}
                      </Text>

                      <Text style={{ marginBottom: 8 }}>
                        Médico: {prescription.recorder}
                      </Text>
                      <Text>Medicamento: {prescription.medicationName}</Text>
                      <Text>
                        Quantidade: {prescription.dispenseValue}{" "}
                        {prescription.dispenseUnit.toLowerCase()}
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
    padding: 16,
  },
  image: {
    resizeMode: "contain",
    justifyContent: "center",
    width: "35%",
  },
  title: {
    fontSize: 36,
    fontFamily: "poppins-bold",
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontFamily: "poppins-bold",
    fontSize: 30,
    color: "white",
    marginBottom: 16,
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
    marginBottom: 8,
  },
  addButton: {
    margin: 16,
    backgroundColor: "white",
  },
});

export default Prescriptions;
