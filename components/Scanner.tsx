import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { CameraView, Camera } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ModalCheckIn from "./ModalCheckIn";
import { useFocusEffect } from "@react-navigation/native";

const Scanner = () => {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [data, setData] = useState<any>([]);

  const resetScanner = () => {
    setScanned(false);
    setQrData(null);
    setIsCameraVisible(false);
    setTimeout(() => {
      setIsCameraVisible(true);
    }, 200);

    setTimeout(() => {
      setIsOpen(false);
    }, 3000);

  };

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
        console.log("Respuesta del CHECKIN:", data);
        setData(data);
        setIsOpen(true); // Abrimos la hoja inferior automáticamente
      } catch (error) {
        console.error("Error en la solicitud:", error);
      } finally {
        resetScanner(); // Reset the scanner after processing the data
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const getCameraPermissions = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
        setIsCameraVisible(true);
      };
      getCameraPermissions();
      return () => setIsCameraVisible(false);
    }, [])
  );

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    setQrData(data);
    checkIn(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {isCameraVisible && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      {data.message && (
        <View style={styles.modal}>
          <ModalCheckIn data={data} isOpen={isOpen} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
});

export default Scanner;
