import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import {
  VStack,
  HStack,
  Box,
  Card,
  Heading,
  Icon,
  ArrowLeftIcon,
  Spinner,
} from "@gluestack-ui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EventsCard from "../components/EventsCard";
import CircleProgress from "../components/CircleProgress";
import { Container, Text } from "../components";

const Dashboard = ({ navigation }: any) => {
  const [data, setData] = useState<any>(null);
  const [dataStorage, setDataStorage] = useState<any>(null);

  useEffect(() => {
    const consultaApi = async () => {
      const userData = await AsyncStorage.getItem("userData");
      const event_data = await AsyncStorage.getItem("event_data");

      if (userData !== null && event_data !== null) {
        setDataStorage(JSON.parse(event_data));
        const token = JSON.parse(userData).data.token;
        const event_id = JSON.parse(event_data).event_unique_id;
        const apiEvents = `https://pruebatu.com/api/v2/event/dashbord/${event_id}`;
        const options = {
          method: "POST",
          headers: {
            Authorization: "Bearer " + token,
          },
        };

        try {
          const response = await fetch(apiEvents, options);
          if (!response.ok) {
            throw new Error("Error:" + `${response.status}`);
          }
          const data = await response.json();
          console.log("Respuesta de la API:", data);
          setData(data.data); // Asegúrate de que data.data contiene los datos que esperas
        } catch (error) {
          console.error("Error en la solicitud:", error);
        }
      }
    };

    consultaApi();
  }, []);

  if (!data) {
    return <Spinner />;
  }

  return (
    <Container>
    <VStack style={styles.container} space="3xl">
      <Box style={styles.circleProgressContainer}>
        <Card p="$5" borderRadius="$lg" minWidth={370} m="$3">
          <HStack style={{ marginBottom: 20 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon style={{ padding: 10 }} size="xl" as={ArrowLeftIcon}></Icon>
            </TouchableOpacity>
            <Heading
              style={{ margin: "auto", maxWidth: "90%" }}
              size="md"
              fontFamily="$heading"
              mb="$4"
            >
              {dataStorage.event_name}
            </Heading>
          </HStack>
          <CircleProgress
            progress={data.total_chackin_tickets}
            total={data.total_order_tickets}
          ></CircleProgress>
        </Card>
      </Box>

      <Text style={styles.subTitle}>Total de registros</Text>

      <ScrollView>
        {data.event_order_tickets.map((ticket: any) => (
          <Box style={[styles.card]}>
            <EventsCard data={ticket}></EventsCard>
          </Box>
        ))}
      </ScrollView>
    </VStack>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,

  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  circleProgressContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  card: {
    flex: 1,
    borderRadius: 10,
    padding: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default Dashboard;
