import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Login } from "../screens/Login";
import { Register } from "../screens/Register";
import { Patient } from "../screens/Register/Patient";
import { Practitioner } from "../screens/Register/Practitioner";

const Stack = createStackNavigator();

export const AccountNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="Patient" component={Patient} />
    <Stack.Screen name="Practitioner" component={Practitioner} />
  </Stack.Navigator>
);
