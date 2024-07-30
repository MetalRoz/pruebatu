import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const translations = {
  en: {
    welcome: "Welcome",
    language: "Language",
    english: "English",
    spanish: "Spanish",
    dashboard: "Dashboard",
    orders: "Orders",
    settings: "Settings",
  },
  es: {
    welcome: "Bienvenido",
    language: "Idioma",
    english: "Inglés",
    spanish: "Español",
    dashboard: "Inicio",
    orders: "Ordenes",
    settings: "Ajustes",
  },
};

const i18n = new I18n(translations);

const setI18nConfig = async () => {
  const savedLanguage = await AsyncStorage.getItem("language");
  const fallback = { languageTag: "en", isRTL: false };

  const languageTag =
    savedLanguage || Localization.locale.split("-")[0] || fallback.languageTag;

  i18n.locale = languageTag;
};

setI18nConfig();

export default i18n;
