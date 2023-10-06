import { View, Text, Image } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Card, Paragraph, Title } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

const Home = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>HealthStash</Text>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.image}
        />
      </View>

      <Text style={styles.subtitle}>Sua saúde em mãos</Text>

      {/* Informações sobre a saúde do paciente */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Saúde do Paciente</Title>
          <Paragraph>
            Aqui você pode encontrar informações sobre seu histórico de saúde,
            resultados de exames e prescrições médicas.
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Agenda dos médicos */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Agenda dos Médicos</Title>
          <Paragraph>
            Confira sua agenda de consultas, agende novos compromissos e receba
            lembretes importantes.
          </Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-start",
    alignItems: "center",
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
    fontSize: 24,
    color: "white",
    marginBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 10,
    borderRadius: 5,
    width: "100%",
  },
  cardTitle: {
    color: "#004460",
    fontWeight: "bold",
  },
});

export default Home;
