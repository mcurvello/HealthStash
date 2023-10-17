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
import Prescriptions from "../screens/Prescriptions";
import { createStackNavigator } from "@react-navigation/stack";
import AllAppointments from "../screens/ScheduledAppointments";
import ScheduledAppointments from "../screens/ScheduledAppointments";
import AllDoneAppointments from "../screens/AllDoneAppointmentes";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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

const PrescriptionsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Prescrições médicas"
        component={Prescriptions}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Buscar"
        component={Map}
        options={{ headerBackTitle: "Voltar" }}
      />
    </Stack.Navigator>
  );
};

const AppointmentsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Consultas do dia"
        component={Appointments}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Consultas agendadas"
        component={ScheduledAppointments}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Consultas realizadas"
        component={AllDoneAppointments}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
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
      <Tab.Screen name="Consultas" component={AppointmentsStack} />
      {userType === "patient" && (
        <Tab.Screen name="Prescrições" component={PrescriptionsStack} />
      )}
      <Tab.Screen name="Perfil" component={Profile} />
    </Tab.Navigator>
  );
};
