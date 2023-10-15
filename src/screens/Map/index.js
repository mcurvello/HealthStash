import { View, Text } from "react-native";
import React from "react";
import styled from "styled-components";
import MapView from "react-native-maps";
import { Searchbar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";

const MapContainer = styled(MapView)`
  height: 100%;
  width: 100%;
`;

const lat = "-23.5505";
const lng = "-46.6333";

export const Map = () => {
  return (
    <>
      <StatusBar style="black" />
      <View
        style={{
          position: "absolute",
          top: 20,
          zIndex: 999,
          width: "90%",
          alignSelf: "center",
        }}
      >
        <Searchbar
          placeholder="Buscar farmácias ou clínicas"
          iconColor="#0086ff"
          style={{ backgroundColor: "#FFF" }}
        />
      </View>
      <MapContainer
        region={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.02,
        }}
      ></MapContainer>
    </>
  );
};
