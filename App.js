import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import * as firebase from "firebase";
import { AuthenticationContextProvider } from "./src/services/authentication/AuthenticationContext";
import { AppNavigator } from "./src/navigation/AppNavigator";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appIdFirebase,
} from "./src/config/settings.js";

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appIdFirebase,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function App() {
  let [fontsLoaded] = useFonts({
    "poppins-regular": Poppins_400Regular,
    "poppins-bold": Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <AuthenticationContextProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </AuthenticationContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
