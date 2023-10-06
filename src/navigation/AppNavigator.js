import { NavigationContainer } from "@react-navigation/native";
import { Main } from "./Main";
import { AccountNavigator } from "./AccountNavigator";
import { useContext } from "react";
import { AuthenticationContext } from "../services/authentication/AuthenticationContext";

export const AppNavigator = () => {
  const { isAuthenticated } = useContext(AuthenticationContext);
  return (
    <NavigationContainer>
      {isAuthenticated ? <Main /> : <AccountNavigator />}
    </NavigationContainer>
  );
};
