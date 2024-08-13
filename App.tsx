import React, { useEffect, useState, useCallback } from "react";
import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import AppNavigator from "./navigation/AppNavigator";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import AssetsIconsPack from "./assets/AssetsIconsPack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";

export default function App() {
  const [mode, setMode] = useState("light");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const checkMode = async () => {
    const modeStorage = await AsyncStorage.getItem("mode");
    if (modeStorage) {
      setMode(modeStorage);
    }
  };

  useEffect(() => {
    checkMode();
  }, []);

  const toggleMode = async () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    await AsyncStorage.setItem("mode", newMode);
  };

  return (
    <GluestackUIProvider config={config}>
      <StatusBar
        backgroundColor={mode === "light" ? "#1976D2" : "#222B45"}
      ></StatusBar>
      <IconRegistry icons={[EvaIconsPack, AssetsIconsPack]} />
      <ApplicationProvider
        {...eva}
        theme={mode === "light" ? eva.light : eva.dark}
      >
        <SafeAreaView style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {/* Coloca aquí el contenido de tu aplicación */}
            <AppNavigator toggleMode={toggleMode} />
          </ScrollView>
        </SafeAreaView>
      </ApplicationProvider>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15
  },
  scrollViewContent: {
    flexGrow: 1, // Asegura que el ScrollView ocupe todo el espacio disponible
  },
});
