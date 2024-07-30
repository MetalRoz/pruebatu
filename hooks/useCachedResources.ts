import * as React from "react";
import { FontAwesome } from "@expo/vector-icons";
import * as Font from "expo-font";
// import * as SplashScreen from "expo-splash-screen";
export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // SplashScreen.preventAutoHideAsync();
        // Load fonts
        await Font.loadAsync({
          ...FontAwesome.font,
          "AlbertSans-Regular": require("../assets/fonts/AlbertSans-Regular.ttf"),
          "AlbertSans-Medium": require("../assets/fonts/AlbertSans-Medium.ttf"),
          "AlbertSans-Bold": require("../assets/fonts/AlbertSans-Bold.ttf"),
          "AlbertSans-SemiBold": require("../assets/fonts/AlbertSans-SemiBold.ttf"),
          "Overpass-ExtraBold": require("../assets/fonts/Overpass-ExtraBold.ttf"),
          "Overpass-ExtraBoldItalic": require("../assets/fonts/Overpass-ExtraBoldItalic.ttf"),
          "Aldrich-Regular": require("../assets/fonts/Aldrich-Regular.ttf"),
          "Alef-Bold": require("../assets/fonts/Alef-Bold.ttf"),
          "Alef-Regular": require("../assets/fonts/Alef-Regular.ttf"),
          "AlegreyaSans-Bold": require("../assets/fonts/AlegreyaSans-Bold.ttf"),
          "AlegreyaSans-Regular": require("../assets/fonts/AlegreyaSans-Regular.ttf"),
          "Amiri-Bold": require("../assets/fonts/Amiri-Bold.ttf"),
          "Amiri-Regular": require("../assets/fonts/Amiri-Regular.ttf"),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        // SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
