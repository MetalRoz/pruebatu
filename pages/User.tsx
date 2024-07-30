import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, ColorValue } from "react-native";
import { useLayout } from "../hooks";
import {
  Layout,
  StyleService,
  useStyleSheet,
  Avatar,
  Icon,
} from "@ui-kitten/components";
import {
  Container,
  Content,
  Text,
  NavigationAction,
  HStack,
  VStack,
} from "../components";
import Images from "../assets/images";
import useToggle from "../hooks/useToggle";
import AlertLogout from "../components/AlertLogout";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  id: number;
  title: string;
  icon: string;
  color: ColorValue | string;
}
interface ItemProps {
  item: Props;
  onPress?(): void;
}

const UserProfile = ({ navigation, toggleMode }: any) => {
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [mode, setMode] = useState("light"); // Default mode
  const { height, width, top, bottom } = useLayout();
  const styles = useStyleSheet(themedStyles);
  const [userData, setUserData] = useState<any>([]);
  const [isPremium] = useToggle(true);
  const [token, setToken] = useState("");

  const checkUser = async () => {
    const userData = await AsyncStorage.getItem("userData");
    if (userData !== null) {
      const data = JSON.parse(userData);
      setUserData(data.data);
      setToken(data.data.token);
    }
  };

  const checkMode = async () => {
    const modeStorage = await AsyncStorage.getItem("mode");
    setMode(modeStorage || "light");
  };

  const logout = async () => {
    const apiLogout = "https://pruebatu.com/api/v2/logout";
    const options = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    await fetch(apiLogout, options);
    await AsyncStorage.clear();
    navigation.navigate("Login");
  };

  useEffect(() => {
    checkUser();
    checkMode();
  }, []);

  const handleModeToggle = async () => {
    await toggleMode();
    await checkMode(); // Update mode after toggling
  };

  const RenderItem = React.useCallback(
    ({ item, onPress }: ItemProps) => {
      const handlePress = async () => {
        if (item.title === "Idiomas") {
          navigation.navigate("Language");
        }
        if (item.title === "Modo noche" || item.title === "Modo día") {
          await handleModeToggle();
        }
      };

      return (
        <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
          <Layout style={styles.item} level="2">
            <View style={styles.itemText}>
              <View style={[styles.icon, { backgroundColor: item.color }]}>
                <Icon pack="assets" name={item.icon} style={styles.titColor} />
              </View>
              <Text
                marginTop={23}
                marginLeft={8}
                children={item.title}
                category="callout"
              />
            </View>
            <Icon
              pack="assets"
              name={"arrow_right"}
              style={[styles.titColor]}
            />
          </Layout>
        </TouchableOpacity>
      );
    },
    [navigation, handleModeToggle]
  );

  const DATA_Profile01 = [
    {
      id: 1,
      icon: "shield",
      title: "Privacidad",
      color: "#949398",
    },
    {
      id: 2,
      icon: "info2x",
      title: "Terminos",
      color: "#949398",
    },
    {
      id: 3,
      icon: "global",
      title: "Idiomas",
      color: "#949398",
    },
    {
      id: 4,
      icon: mode === "light" ? "moon" : "sunny",
      title: mode === "light" ? "Modo noche" : "Modo día",
      color: mode === "light" ? "#215190" : "#d6b600", // Yellow color for light mode
    },
  ];

  return (
    <Container style={styles.container}>
      <Layout style={[styles.layout, { paddingTop: top + 8 }]} level="8">
        <HStack itemsCenter>
          <NavigationAction status="primary" icon="arrow_left" size="giant" />
        </HStack>
        <VStack alignSelfCenter>
          <Avatar
            source={Images.avatar.avatar10}
            //@ts-ignore
            style={styles.avatar}
          />
          {isPremium && (
            <Layout level="5" style={styles.crown}>
              <Icon pack="assets" name="crown" style={styles.icCrown} />
            </Layout>
          )}
        </VStack>
        <Text category="h5" center marginTop={16}>
          {userData.fullname}
        </Text>
      </Layout>
      <Content contentContainerStyle={styles.content}>
        {DATA_Profile01.map((item, index) => (
          <RenderItem item={item} key={index} />
        ))}
      </Content>

      <Text
        category="callout"
        status="platinum"
        uppercase
        center
        onPress={() => setShowAlertDialog(true)}
        marginBottom={50}
        children="Cerrar sesión"
      />

      <AlertLogout
        isOpen={showAlertDialog}
        onClose={() => {
          setShowAlertDialog(false);
        }}
        logout={logout}
      />
    </Container>
  );
};

export default UserProfile;

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  layout: {
    height: "30%",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 32,
  },
  crown: {
    position: "absolute",
    right: -4,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: "text-white-color",
    justifyContent: "center",
    alignItems: "center",
  },
  icCrown: {
    width: 16,
    height: 16,
  },
  buttonUpgrade: {
    alignSelf: "center",
    paddingHorizontal: 24,
    marginTop: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 20,
    justifyContent: "space-between",
    paddingRight: 16,
    marginHorizontal: 24,
  },
  titColor: {
    tintColor: "white",
  },
  icon: {
    borderRadius: 16,
    padding: 12,
    margin: 10,
  },
  itemText: {
    flexDirection: "row",
  },
  content: {
    marginTop: 24,
  },
});
