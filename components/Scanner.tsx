import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  useColorScheme,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { Icon } from "@gluestack-ui/themed";
import { CheckCircleIcon, CheckIcon, XCircleIcon } from "lucide-react-native";
import { Header } from "@rneui/themed";

function BottomSheet({ isOpen, toggleSheet, duration = 500, children }) {
  const colorScheme = useColorScheme();
  const height = useSharedValue(0);
  const progress = useDerivedValue(() =>
    withTiming(isOpen.value ? 0 : 1, { duration })
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * 2 * height.value }],
  }));

  const backgroundColorSheetStyle = {
    backgroundColor: colorScheme === "light" ? "#f8f9ff" : "#272B3C",
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    zIndex: isOpen.value
      ? 1
      : withDelay(duration, withTiming(-1, { duration: 0 })),
  }));

  return (
    <>
      <Animated.View style={[sheetStyles.backdrop, backdropStyle]}>
        <TouchableOpacity style={styles.flex} onPress={toggleSheet} />
      </Animated.View>

      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={[sheetStyles.sheet, sheetStyle, backgroundColorSheetStyle]}
      >
        {children}
      </Animated.View>
    </>
  );
}

const sheetStyles = StyleSheet.create({
  sheet: {
    padding: 16,
    paddingRight: 2,
    paddingLeft: 2,
    height: 150,
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});

const Scanner = () => {
  const [hasPermission, setHasPermission] = useState<null | boolean>(null);
  const [scanned, setScanned] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [data, setData] = useState<any>([]);
  const colorScheme = useColorScheme();
  const isSheetOpen = useSharedValue(isOpen);

  const resetScanner = () => {
    setScanned(false);
    setQrData(null);
    setIsCameraVisible(true);
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
        setIsOpen(true);
        isSheetOpen.value = true;
      } catch (error) {
        console.error("Error en la solicitud:", error);
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

  useEffect(() => {
    if (isOpen) {
      setIsCameraVisible(false);
    } else {
      setIsCameraVisible(true);
      resetScanner();
    }
  }, [isOpen]);

  const toggleSheet = () => {
    setIsOpen(!isOpen);
    isSheetOpen.value = !isOpen;
    if (!isOpen) {
      resetScanner();
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const contentStyle = {
    color: colorScheme === "light" ? "#001a72" : "#f8f9ff",
    textDecorationColor: colorScheme === "light" ? "#001a72" : "#f8f9ff",
  };

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
      <BottomSheet isOpen={isSheetOpen} toggleSheet={toggleSheet}>
        <View style={data.response ? styles.headerSuccess : styles.headerError}>
          <Icon
            style={styles.test}
            as={data.response ? CheckCircleIcon : XCircleIcon}
            size={40}
          />
        </View>

        <Animated.Text style={contentStyle}>{data.message}</Animated.Text>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({

  headerSuccess: {
    backgroundColor: "#34C759",
    height: 70,
    width: 420,
    top: -32,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },

  headerError: {
    backgroundColor: "#ff2d2d",
    height: 70,
    width: 420,
    top: -32,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },

  test: {
    color: "white",
    margin: "auto",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    marginTop: 16,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  bottomSheetButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 2,
  },
  bottomSheetButtonText: {
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  flex: {
    flex: 1,
  },
});

export default Scanner;
