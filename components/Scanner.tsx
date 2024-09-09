import React, { useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
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

export default function Scanner() {
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null); // Estado para almacenar la respuesta de la API
  const [checkInStatus, setCheckInStatus] = useState<number | null>(null); // Estado para el estado del check-in
  const [forceRender, setForceRender] = useState(0); // Estado adicional para forzar re-renderizado
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar el loading

  // Verifica si el ticket escaneado coincide con el último almacenado
  const verifyLastTicketId = async (ticketId: string) => {
    const lastTicketId = await AsyncStorage.getItem("lastScannedTicket");
    return lastTicketId === ticketId;
  };

  // Almacena el último ticket escaneado en AsyncStorage
  const storeLastTicketId = async (ticketId: string) => {
    await AsyncStorage.setItem("lastScannedTicket", ticketId);
  };

  const checkIn = async (ticketId: any) => {
    setIsLoading(true); // Iniciar loading

    const isLastTicket = await verifyLastTicketId(ticketId);

    if (isLastTicket) {
      // Si el ticket coincide con el último almacenado, mostrar pantalla anaranjada
      setCheckInStatus(2);
      setIsLoading(false); // Finalizar loading
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

        setData(responseData);

        // Verificar el contenido de responseData.message
        if (
          responseData.message.includes(
            "Este ticket ya se encuentra en el evento"
          )
        ) {
          setCheckInStatus(1);
          await storeLastTicketId(ticketId); // Almacenar el ticketId si es válido
        } else if (
          responseData.message.includes("Este ticket no es para este evento")
        ) {
          setCheckInStatus(0);
        }

        // Forzamos un re-render después de cambiar el estado
        setForceRender((prev) => prev + 1);

        console.log("Respuesta del CHECKIN:", responseData);
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        setIsLoading(false); // Finalizar loading
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
    <View style={styles.container} key={forceRender}>
      {isLoading ? (
        // Mostrar indicador de carga mientras se realiza el check-in
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
              : styles.alreadyCheckedIn, // Estilo para el estado anaranjado
          ]}
        >
          {checkInStatus === 1 ? (
            <>
              <FontAwesome name="check-circle" size={80} color="white" />
              <Text style={styles.resultText}>Checked in!</Text>
              <Text style={styles.vipText}>VIP</Text>
              <View style={styles.infoContainer}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Name</Text>
                  <Text style={styles.value}>Karna Ballefant</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Title</Text>
                  <Text style={styles.value}>Assistant Manager</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Company</Text>
                  <Text style={styles.value}>Yodo</Text>
                </View>
              </View>
            </>
          ) : checkInStatus === 0 ? (
            <>
              <FontAwesome name="times-circle" size={80} color="white" />
              <Text style={styles.resultText}>{data.message}</Text>
            </>
          ) : (
            // Pantalla para ticket ya escaneado
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
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  vipText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
  },
  infoContainer: {
    marginTop: 20,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginVertical: 5,
  },
  label: {
    color: "#fff",
    fontSize: 18,
  },
  value: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
