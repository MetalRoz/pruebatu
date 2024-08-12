import React, { useEffect, useState } from "react";
import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import AppNavigator from "./navigation/AppNavigator";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import AssetsIconsPack from "./assets/AssetsIconsPack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [mode, setMode] = useState("light");

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
      <StatusBar backgroundColor={mode === "light" ? "#1976D2" : "#222B45"}></StatusBar>
      <IconRegistry icons={[EvaIconsPack, AssetsIconsPack]} />
      <ApplicationProvider
        {...eva}
        theme={mode === "light" ? eva.light : eva.dark}
      >
        <AppNavigator toggleMode={toggleMode} />
      </ApplicationProvider>
    </GluestackUIProvider>
  );
}
