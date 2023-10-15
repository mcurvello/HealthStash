import { View, Image, Touchable, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { Card, Paragraph, Title, Text, Avatar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";

const Home = ({ navigation }) => {
  const { userType } = useContext(AuthenticationContext);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>Health Stash</Text>
        <Image
          source={require("../../../assets/logo.png")}
          style={styles.image}
        />
      </View>

      <Text style={styles.subtitle}>
        {userType === "patient"
          ? "Sua saúde em mãos"
          : "Tenha a saúde de seus pacientes em mãos"}
      </Text>

      <>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.cardTitle}>
              {userType === "patient" ? "Sua Saúde" : "Saúde de seus pacientes"}
            </Title>
            <Paragraph style={styles.cardDescription}>
              {userType === "patient"
                ? "Aqui você pode encontrar informações sobre seu histórico de saúde, resultados de exames e prescrições médicas."
                : "Aqui você pode encontrar informações sobre o histórico de saúde de seus pacientes, e sua agenda de consultas."}
            </Paragraph>
          </Card.Content>
        </Card>
        <View
          style={{ alignItems: "flex-start", width: "100%", marginTop: 24 }}
        >
          {userType === "patient" && (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("Médicos")}
            >
              <Text
                variant="labelLarge"
                style={{ fontFamily: "poppins-regular", color: "#fff" }}
              >
                Agendar consulta
              </Text>
              <Avatar.Icon
                icon="chevron-right"
                color="pink"
                backgroundColor="transparent"
                size={48}
                style={{ marginLeft: -12 }}
                onPress={() => console.log("Pressed")}
              />
            </TouchableOpacity>
          )}
          {userType === "practitioner" && (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("Pacientes")}
            >
              <Text
                variant="labelLarge"
                style={{ fontFamily: "poppins-regular", color: "#fff" }}
              >
                Pacientes
              </Text>
              <Avatar.Icon
                icon="chevron-right"
                color="pink"
                backgroundColor="transparent"
                size={48}
                style={{ marginLeft: -12 }}
                onPress={() => console.log("Pressed")}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("Consultas")}
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
              onPress={() => console.log("Pressed")}
            />
          </TouchableOpacity>
          {userType === "patient" && (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
              onPress={() => navigation.navigate("Register")}
            >
              <Text
                variant="labelLarge"
                style={{ fontFamily: "poppins-regular", color: "#fff" }}
              >
                Prescrições médicas
              </Text>
              <Avatar.Icon
                icon="chevron-right"
                color="pink"
                backgroundColor="transparent"
                size={48}
                style={{ marginLeft: -12 }}
                onPress={() => console.log("Pressed")}
              />
            </TouchableOpacity>
          )}
        </View>
      </>
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
    fontFamily: "poppins-bold",
    fontSize: 32,
    color: "white",
  },
  subtitle: {
    fontFamily: "poppins-regular",
    fontSize: 24,
    color: "white",
    marginBottom: 40,
    textAlign: "center",
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
    fontFamily: "poppins-bold",
  },
  cardDescription: {
    fontFamily: "poppins-regular",
  },
});

export default Home;
