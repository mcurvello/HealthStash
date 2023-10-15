import React, { useState, createContext } from "react";
import * as firebase from "firebase";

import { loginRequest } from "../AuthenticationService";
import { getAuthToken, getPatients } from "../../api/api";

export const AuthenticationContext = createContext();

export const AuthenticationContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({});
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState("patient");

  firebase.auth().onAuthStateChanged((usr) => {
    if (usr) {
      setUser(usr);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  });

  const getPatientData = async (emailToFind, profile) => {
    const accessToken = await getAuthToken();
    if (accessToken) {
      if (profile === "patient") {
        const result = await getPatients(accessToken);

        const foundPatient = result.entry.find((patient) => {
          const email = patient.resource.telecom.find(
            (contact) =>
              contact.system === "email" && contact.value === emailToFind
          );
          return email !== undefined;
        });

        if (foundPatient) {
          const { active, name, telecom, gender, birthDate, address, id } =
            foundPatient.resource;

          const data = {
            resourceType: "Patient",
            active,
            name,
            telecom,
            gender,
            birthDate,
            address,
            id,
          };

          setUserData(data);
        }
      }
    }
  };

  const onLogin = (email, password, profile) => {
    setIsLoading(true);
    loginRequest(email, password)
      .then((u) => {
        setUser(u);
        setIsLoading(false);
        setUserType(profile);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e.toString());
      });
  };

  const onRegister = (email, password) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((u) => {
        setUser(u);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e.toString());
      });
  };

  const onLogout = () => {
    setUser(null);
    firebase.auth().signOut();
  };

  return (
    <AuthenticationContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        userData,
        userType,
        isLoading,
        error,
        onLogin,
        onRegister,
        onLogout,
        setUserType,
        setUserData,
        getPatientData,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
