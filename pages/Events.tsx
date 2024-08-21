import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventsLive from "../components/EventsLive";
import EventsPast from "../components/EventsPast";
import { Avatar, Icon, Pressable } from "@gluestack-ui/themed";
import { User } from "lucide-react-native";
import { Tab, TabView } from "@rneui/themed";
import { Container, VStack, HStack } from "../components";

interface EventData {
  event_name: string;
  event_start_datetime: string;
  EVENT_TOTAL_TICKETS: number;
  EVENT_ORDERD_TICKETS: number;
  event_unique_id: any;
}

export default function Events({ navigation, toggleMode }: any) {
  const [liveData, setLiveData] = useState<EventData[]>([]);
  const [pastData, setPastData] = useState<EventData[]>([]);
  const [filteredLiveData, setFilteredLiveData] = useState<EventData[]>([]);
  const [filteredPastData, setFilteredPastData] = useState<EventData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const apiEventsLive = "https://pruebatu.com/api/v2/event/live";
  const apiEventsPast = "https://pruebatu.com/api/v2/event/past";
  const [index, setIndex] = useState(0);
  const [token, setToken] = useState("");
  const [mode, setMode] = useState<any>("light");

  const fetchEvents = async (
    apiUrl: string,
    setData: React.Dispatch<React.SetStateAction<EventData[]>>
  ) => {
    const options = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    try {
      const response = await fetch(apiUrl, options);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setData(data.data);
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const checkToken = async () => {
    const storage = await AsyncStorage.getItem("userData");
    const modeStorage = await AsyncStorage.getItem("mode");
    if (storage !== null) {
      const token = JSON.parse(storage).data.token;
      setToken(token);
    }
    setMode(modeStorage);
  };

  useEffect(() => {
    checkToken();
  }, [toggleMode]);

  useEffect(() => {
    if (token) {
      if (index === 0) {
        fetchEvents(apiEventsLive, setLiveData);
      } else {
        fetchEvents(apiEventsPast, setPastData);
      }
    }
  }, [index, token]);

  useEffect(() => {
    filterData();
  }, [searchQuery, liveData, pastData]);

  const filterData = () => {
    const filteredLive = liveData.filter((event) =>
      event.event_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const filteredPast = pastData.filter((event) =>
      event.event_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLiveData(filteredLive);
    setFilteredPastData(filteredPast);
  };

  const renderItems = (data: EventData[], Component: any) => {
    if (data.length === 0) {
      return <Text>No hay datos disponibles.</Text>;
    }
    return data.map((item, index) => (
      <Container key={index}>
        <Component item={item} index={index} navigation={navigation} />
      </Container>
    ));
  };

  return (
    <Container>
      <View
        style={[
          styles.header,
          { backgroundColor: mode === "light" || "" ? "#1976D2" : "#222B45" }, // Ajusta el color para modo oscuro
        ]}
      >
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar Evento"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <VStack>
          <HStack>
            <Pressable
              onPress={() => navigation.navigate("User", { test: 123 })}
            >
              <Avatar bgColor="$indigo600">
                <Icon as={User} color="white" size="lg" />
              </Avatar>
            </Pressable>
          </HStack>
        </VStack>
      </View>
      <>
        <Tab
          value={index}
          onChange={(e) => setIndex(e)}
          indicatorStyle={{
            backgroundColor: mode === "light" ? "#1976D2" : "white",
            height: 3,
          }}
          variant="default"
        >
          <Tab.Item
            title="Próximos Eventos"
            titleStyle={{
              fontSize: 13,
              color: mode === "light" ? "black" : "white",
            }}
          />
          <Tab.Item
            title="Eventos Pasados"
            titleStyle={{
              fontSize: 13,
              color: mode === "light" ? "black" : "white",
            }}
          />
        </Tab>

        <TabView value={index} onChange={setIndex} animationType="spring">
          <TabView.Item style={{ width: "100%" }}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Coloca aquí el contenido de tu aplicación */}
                {renderItems(filteredLiveData, EventsLive)}
              </ScrollView>
            </ScrollView>
          </TabView.Item>
          <TabView.Item style={{ width: "100%" }}>
            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Coloca aquí el contenido de tu aplicación */}
                {renderItems(filteredPastData, EventsPast)}
              </ScrollView>
            </ScrollView>
          </TabView.Item>
        </TabView>
      </>
    </Container>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1, // Asegura que el ScrollView ocupe todo el espacio disponible
  },
  header: {
    padding: 10,
    paddingTop: 40,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  searchInput: {
    backgroundColor: "#FFF",
    borderRadius: 25,
    padding: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    width: "82%",
  },
  scrollContainer: {
    padding: 10,
  },
});
