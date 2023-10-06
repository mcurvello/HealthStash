import { View } from "react-native";
import React, { useContext } from "react";
import { Avatar, Button, Text } from "react-native-paper";
import { AuthenticationContext } from "../../services/authentication/AuthenticationContext";
import { StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Image } from "react-native";

const Profile = () => {
  const { onLogout, user } = useContext(AuthenticationContext);

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
      <Avatar.Icon
        size={150}
        icon="human"
        color="#004460"
        style={{ backgroundColor: "#fff" }}
      />
      <View
        style={{
          marginTop: 20,
          marginBottom: 80,
          height: 200,
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Text
          variant="titleLarge"
          style={{ fontWeight: "bold", color: "#fff" }}
        >
          Marcio Curvello
        </Text>
        <Text variant="titleMedium" style={{ color: "#fff" }}>
          {user.email}
        </Text>
      </View>

      <Button
        icon="logout"
        mode="contained"
        style={{ width: "50%", backgroundColor: "#fff", marginTop: 20 }}
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
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
});

export default Profile;
