import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import i18n from "../hooks/i18n";
import { LanguageManager } from "../hooks/languageManager";
import { Container, Text } from "../components";

const Language = ({ navigation }: any) => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    const loadLanguage = async () => {
      const lang = await LanguageManager.getLanguage();
      setSelectedLanguage(lang);
    };
    loadLanguage();
  }, []);

  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
    await LanguageManager.setLanguage(language);
    navigation.navigate("Events"); // Refresh the app
  };

  return (
    <Container style={styles.container}>
      <View style={styles.languageOption}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => handleLanguageChange("en")}
        >
          <View style={styles.radioCircle}>
            {selectedLanguage === "en" && <View style={styles.selectedRb} />}
          </View>
          <Text style={styles.radioText}>{i18n.t("english")}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.languageOption}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => handleLanguageChange("es")}
        >
          <View style={styles.radioCircle}>
            {selectedLanguage === "es" && <View style={styles.selectedRb} />}
          </View>
          <Text style={styles.radioText}>{i18n.t("spanish")}</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 20,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#444",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#444",
  },
  radioText: {
    fontSize: 16,
  },
});

export default Language;
