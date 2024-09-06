import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Alert,
  Button,
  Text,
  View,
} from "react-native";

import {
  startScan,
  stopScan,
  initializeScanner,
  addScanSuccessListener,
  addScanFailureListener,
} from "../modules/laserscan-module";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Scanner() {
  const [error, setError] = useState<string | null>(null);

  const checkIn = async (ticketId: any) => {
    const userData = await AsyncStorage.getItem("userData");
    const event_data = await AsyncStorage.getItem("event_data");
    if (userData && event_data !== null) {
      const eventId = JSON.parse(event_data).event_unique_id;
      const token = JSON.parse(userData).data.token;
      const options = {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      const apiCheckIn = `https://pruebatu.com/api/v2/ticketcode/${ticketId}/${eventId}`;
      try {
        const response = await fetch(apiCheckIn, options);
        if (!response.ok) {
          throw new Error("Error:" + `${response.status}`);
        }
        const data = await response.json();
        Alert.alert(data.message);
        console.log("Respuesta del CHECKIN:", data);
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    }
  };

  useEffect(() => {
    initializeScanner();

    const scanSuccessListener = addScanSuccessListener((event) => {
      checkIn(event.data);
    });

    const scanFailureListener = addScanFailureListener((event) => {
      setError(event.error);
    });

    return () => {
      scanSuccessListener.remove();
      scanFailureListener.remove();
    };
  }, []);

  const iniciar = () => {
    startScan();
  };

  const detener = () => {
    stopScan();
  };

  return (
    <View style={styles.container}>
      <Button title="Iniciar scanner" onPress={iniciar}/>
      <Button title="Detener scanner" onPress={detener}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 100,
    width: 200,
    margin: "auto",
    display: "flex",
    gap: 20
  },
  imageBackground: {
    width: "100%",
    height: 400, // Ajusta según el tamaño necesario
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  entryGateText: {
    color: "#fff",
    fontSize: 18,
  },
  gateText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    marginTop: 20,
  },
  column: {
    marginHorizontal: 10,
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontSize: 16,
  },
  value: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 50,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
