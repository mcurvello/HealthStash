import { View } from "react-native";
import React, { useContext } from "react";
import { Avatar, Button, Text } from "react-native-paper";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";
import { formatarDataParaBR } from "../../utils/date";

const Profile = () => {
  const { onLogout, user, userData, userType } = useContext(
    AuthenticationContext
  );

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
      <Avatar.Icon
        size={150}
        icon="human"
        color="#004460"
        style={{ backgroundColor: "#fff" }}
      />
      <Text
        variant="headlineMedium"
        style={{ marginTop: 16, fontFamily: "poppins-bold", color: "#fff" }}
      >
        {userType === "patient"
          ? "PACIENTE"
          : userData.gender === "male"
          ? "MÉDICO"
          : "MÉDICA"}
      </Text>
      <Text
        variant="headlineSmall"
        style={{ marginTop: 40, fontFamily: "poppins-bold", color: "#fff" }}
      >
        {userData.name[0].given[0]} {userData.name[0].family}
      </Text>
      <View
        style={{
          marginTop: 70,
          marginBottom: 80,
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <Text
            variant="titleMedium"
            style={{ fontFamily: "poppins-bold", color: "#fff" }}
          >
            Data de nascimento:{" "}
          </Text>
          <Text
            variant="titleMedium"
            style={{ fontFamily: "poppins-regular", color: "#fff" }}
          >
            {formatarDataParaBR(userData.birthDate)}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            variant="titleMedium"
            style={{ fontFamily: "poppins-bold", color: "#fff" }}
          >
            Telefone:{" "}
          </Text>
          <Text
            variant="titleMedium"
            style={{ fontFamily: "poppins-regular", color: "#fff" }}
          >
            {userData.telecom[0].value}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            variant="titleMedium"
            style={{ fontFamily: "poppins-bold", color: "#fff" }}
          >
            Email:{" "}
          </Text>
          <Text
            variant="titleMedium"
            style={{ fontFamily: "poppins-regular", color: "#fff" }}
          >
            {user.email}
          </Text>
        </View>
      </View>

      <Button
        icon="logout"
        mode="contained"
        style={{ width: "50%", backgroundColor: "#fff" }}
        textColor="#004460"
        onPress={() => onLogout()}
      >
        SAIR
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0083C5",
    alignItems: "center",
    padding: 16,
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
});

export default Profile;
