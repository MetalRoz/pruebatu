import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import {
  startScan,
  stopScan,
  initializeScanner,
  addScanSuccessListener,
  addScanFailureListener,
} from "../modules/laserscan-module";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";

export default function Scanner() {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [checkInStatus, setCheckInStatus] = useState<number | null>(null);
  const [forceRender, setForceRender] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Función para cargar y reproducir sonido
  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/sounds/beep_sound.mp3")
    );
    setSound(sound);
    await sound.playAsync();
  };

  const verifyLastTicketId = async (ticketId: string) => {
    const lastTicketId = await AsyncStorage.getItem("lastScannedTicket");
    return lastTicketId === ticketId;
  };

  const storeLastTicketId = async (ticketId: string) => {
    await AsyncStorage.setItem("lastScannedTicket", ticketId);
  };

  const checkIn = async (ticketId: any) => {
    setIsLoading(true);

    const isLastTicket = await verifyLastTicketId(ticketId);

    if (isLastTicket) {
      setCheckInStatus(2);
      setIsLoading(false);
      setForceRender((prev) => prev + 1);
      return;
    }

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
        const responseData = await response.json();
        console.log(responseData);
        setData(responseData);

        if (responseData.data.status === "1") {
          setCheckInStatus(1);
          await storeLastTicketId(ticketId);
        } else if (responseData.data.status === "0") {
          setCheckInStatus(0);
        }

        setForceRender((prev) => prev + 1);
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    initializeScanner();

    const scanSuccessListener = addScanSuccessListener((event) => {
      checkIn(event.data);
      playSound();
    });

    const scanFailureListener = addScanFailureListener((event) => {
      setError(event.error);
    });

    return () => {
      scanSuccessListener.remove();
      scanFailureListener.remove();
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const iniciar = () => {
    startScan();
  };

  const detener = () => {
    stopScan();
  };

  return (
    <View style={styles.container} key={forceRender}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Procesando check-in...</Text>
        </View>
      ) : checkInStatus === null ? (
        <>
          <Button title="Iniciar scanner" onPress={iniciar} />
          <Button title="Detener scanner" onPress={detener} />
        </>
      ) : (
        <View
          style={[
            styles.fullScreenContainer,
            checkInStatus === 1
              ? styles.validCheckin
              : checkInStatus === 0
              ? styles.invalidCheckin
              : styles.alreadyCheckedIn,
          ]}
        >
          {checkInStatus === 1 ? (
            <>
              <FontAwesome name="check-circle" size={80} color="white" />
              <Text style={styles.verifiedText}>VERIFICADO</Text>

              <View style={styles.vipContainer}>
                <Text style={styles.vipText}>VIP</Text>

                <View style={styles.infoContainer}>
                  <View>
                    <Text style={styles.value}>105A</Text>
                  </View>
                  <View>
                    <Text style={styles.value}>11FL</Text>
                  </View>
                  <View>
                    <Text style={styles.value}>23C</Text>
                  </View>
                </View>
              </View>
            </>
          ) : checkInStatus === 0 ? (
            <>
              <FontAwesome name="times-circle" size={80} color="white" />
              <Text style={styles.resultText}>{data.message}</Text>
            </>
          ) : (
            <>
              <FontAwesome
                name="exclamation-triangle"
                size={80}
                color="white"
              />
              <Text style={styles.resultText}>
                Este ticket coincide con el último escaneo.
              </Text>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#000",
  },
  fullScreenContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  validCheckin: {
    backgroundColor: "green",
  },
  invalidCheckin: {
    backgroundColor: "red",
  },
  alreadyCheckedIn: {
    backgroundColor: "orange",
  },
  resultText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  verifiedText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 20,
  },
  checkImage: {
    width: 100,
    height: 100,
  },
  vipContainer: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
    paddingVertical: 30,
  },
  vipText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    margin: "auto",
  },
  infoContainer: {
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    gap: 30,
  },
  value: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
