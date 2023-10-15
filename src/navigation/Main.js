import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Patients from "../screens/Patients";
import Practitioners from "../screens/Practitioners";
import { Map } from "../screens/Map";
import { AuthenticationContext } from "../services/authentication/AuthenticationContext";
import Appointments from "../screens/Appointments";

const Tab = createBottomTabNavigator();

const Consulta = () => {
  return <Map />;
};

const TAB_ICON = {
  Home: "home",
  Consultas: "event",
  Perfil: "account-circle",
  Pacientes: "note",
  Médicos: "note",
  Prescrições: "book",
};

const screenOptions = ({ route }) => {
  const iconName = TAB_ICON[route.name];
  return {
    tabBarIcon: ({ size, color }) => (
      <MaterialIcons name={iconName} size={size} color={color} />
    ),
    tabBarActiveTintColor: "#0083C5",
    tabBarInactiveTintColor: "gray",
    headerShown: false,
  };
};

export const Main = () => {
  const { userType } = useContext(AuthenticationContext);

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={Home} />
      {userType !== "patient" && (
        <Tab.Screen name="Pacientes" component={Patients} />
      )}
      {userType !== "practitioner" && (
        <Tab.Screen name="Médicos" component={Practitioners} />
      )}
      <Tab.Screen name="Consultas" component={Appointments} />
      {userType === "patient" && (
        <Tab.Screen name="Prescrições" component={Appointments} />
      )}
      <Tab.Screen name="Perfil" component={Profile} />
    </Tab.Navigator>
  );
};
