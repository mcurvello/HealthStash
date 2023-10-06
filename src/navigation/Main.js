import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import Home from "../screens/Home";
import Profile from "../screens/Profile";
import Patients from "../screens/Patients";
import Practitioners from "../screens/Practitioners";
import { Map } from "../screens/Map";

const Tab = createBottomTabNavigator();

const Consulta = () => {
  return <Map />;
};

const TAB_ICON = {
  Home: "home",
  Consulta: "search",
  Perfil: "account-circle",
  Pacientes: "note",
  Médicos: "note",
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
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Pacientes" component={Patients} />
      <Tab.Screen name="Médicos" component={Practitioners} />
      <Tab.Screen name="Consulta" component={Consulta} />
      <Tab.Screen name="Perfil" component={Profile} />
    </Tab.Navigator>
  );
};
