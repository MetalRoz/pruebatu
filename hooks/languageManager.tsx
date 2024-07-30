import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../hooks/i18n";

export const LanguageManager = {
  setLanguage: async (lang: string) => {
    await AsyncStorage.setItem("language", lang);
    i18n.locale = lang;
  },
  getLanguage: async () => {
    return (await AsyncStorage.getItem("language")) || "en";
  },
};
