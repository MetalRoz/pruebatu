import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTheme } from "@ui-kitten/components";
import Dashboard from "../pages/Dashboard";
import Orders from "../pages/Orders";
import UserProfile from "../pages/User";
import { Icon } from "@gluestack-ui/themed";
import {
  LayoutDashboardIcon,
  QrCodeIcon,
  ScrollTextIcon,
  Settings,
} from "lucide-react-native";
import Scanner from "../components/Scanner";
import i18n from "../hooks/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const MyTabs = ({ toggleMode }: any) => {
  const theme = useTheme();
  const [mode, setMode] = useState<any>("light");

  const checkMode = async () => {
    const modeStorage = await AsyncStorage.getItem("mode");
    setMode(modeStorage);
  };

  useEffect(() => {
    checkMode();
  }, [toggleMode]);

  const tabBarStyle = {
    backgroundColor:
      mode === "dark" ? theme["color-basic-800"] : theme["color-basic-100"],
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: tabBarStyle,
        tabBarActiveTintColor:
          mode === "dark"
            ? theme["color-primary-100"]
            : theme["color-primary-500"],
        tabBarInactiveTintColor: theme["color-basic-600"],
      }}
    >
      <Tab.Screen
        name={i18n.t("dashboard")}
        component={Dashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon as={LayoutDashboardIcon} color={color} size="xl" />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Check-In"
        component={Scanner}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon as={QrCodeIcon} color={color} size="xl" />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={i18n.t("orders")}
        component={Orders}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon as={ScrollTextIcon} color={color} size="xl" />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={i18n.t("settings")}
        component={(props: any) => (
          <UserProfile {...props} toggleMode={toggleMode} />
        )}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon as={Settings} color={color} size="xl" />
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

const BottomTabNavigator = ({ toggleMode }: any) => {
  return <MyTabs toggleMode={toggleMode} />;
};

export default BottomTabNavigator;
