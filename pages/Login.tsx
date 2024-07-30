import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  Image,
  ActivityIndicator,
  Pressable,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useToast,
  Toast,
  Icon,
  VStack,
  ToastTitle,
  ToastDescription,
  CheckCircleIcon,
} from "@gluestack-ui/themed";

export default function Login({ navigation }: any) {
  const toast = useToast();

  const api = "https://pruebatu.com";
  const loginMethod = "api/v2/checkin/login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const showAlert = (message: any) =>
    Alert.alert(
      "Revise sus datos",
      message,
      [
        {
          text: "OK",
          style: "cancel",
        },
      ],
      {
        cancelable: true,
      }
    );

  const onLogin = async () => {
    const loginApi = `${api}/${loginMethod}`;
    setLoading(true);
    try {
      const response = await axios.postForm(loginApi, {
        email: email,
        password: password,
      });

      const data = response.data;
      setLoading(false);
      if (data.response === true) {
        toast.show({
          duration: 1500,
          placement: "bottom",
          render: ({ id }) => {
            const toastId = "toast-" + id;
            return (
              <Toast bg="$success700" nativeID={toastId}>
                <Icon as={CheckCircleIcon} color="$white" mt="$1" mr="$3" />
                <VStack space="xs">
                  <ToastTitle color="$white">Cuenta Verificada</ToastTitle>
                  <ToastDescription color="$textLight50">
                    {data.message}
                  </ToastDescription>
                </VStack>
              </Toast>
            );
          },
        });
        await AsyncStorage.setItem("userData", JSON.stringify(data));
        navigation.navigate("Events");
      } else {
        showAlert(data.message);
      }
    } catch (error: any) {
      setLoading(false);
      showAlert(error.message);
    }
  };
  return (
    <ImageBackground
      source={require("../assets/images/fondo-login.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/images/logo.png")}
          resizeMode="contain"
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Contraseña"
            placeholderTextColor="#ccc"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.button} onPress={onLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },

  logo: {
    width: 130,
    height: 70,
  },

  background: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    alignItems: "center",
  },

  input: {
    width: "100%",
    padding: 10,
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    color: "#fff",
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    paddingRight: 40, // espacio para el icono
  },
  toggleButton: {
    position: "absolute",
    right: 10,
    top: 13,
    justifyContent: "center",
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#1e40ff",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
