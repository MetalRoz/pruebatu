import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../pages/Login";
import Events from "../pages/Events";
import UserProfile from "../pages/User";
import BottomTabNavigator from "./BottomTabNavigator";
import Language from "../pages/Language";

const Stack = createNativeStackNavigator();

const AppNavigator = ({ toggleMode }: any) => {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialRoute = async () => {
      try {
        const storage = await AsyncStorage.getItem("userData");
        if (storage !== null) {
          const token = JSON.parse(storage).data.token;
          setInitialRoute(token ? "Events" : "Login");
        } else {
          setInitialRoute("Login");
        }
      } catch (error) {
        console.error("Error fetching token:", error);
        setInitialRoute("Login");
      }
    };

    fetchInitialRoute();
  }, []);

  if (initialRoute === null) {
    // Aquí puedes mostrar un cargador mientras se determina la ruta inicial
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Events">
          {(props) => <Events {...props} toggleMode={toggleMode} />}
        </Stack.Screen>
        <Stack.Screen name="User">
          {(props) => <UserProfile {...props} toggleMode={toggleMode} />}
        </Stack.Screen>
        <Stack.Screen name="Dashboard">
          {(props) => <BottomTabNavigator {...props} toggleMode={toggleMode} />}
        </Stack.Screen>
        <Stack.Screen
          name="Language"
          component={Language}
          options={{ title: "Language Settings", headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
