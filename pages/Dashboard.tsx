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
  const [checkInCount, setCheckInCount] = useState<any>(null);
  const [totalTickets, setTotalTickets] = useState<any>(null);

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
          setData(data.data.event_tickets);

          let totalTickets = 0;
          let totalCheckInCount = 0;

          console.log("Datos recibidos:", data.data.event_tickets);

          data.data.event_tickets.forEach((item) => {
            const checkInCount$ = parseInt(item.CHECKIN_COUNT);
            totalTickets += item.TOTAL_TICKETS;
            totalCheckInCount += checkInCount$;
          });

          // Actualizar los estados
          setTotalTickets(totalTickets);
          setCheckInCount(totalCheckInCount);

          // Imprimir resultados
          console.log("Total Tickets:", totalTickets);
          console.log("Total Check-In Count:", totalCheckInCount);
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
                <Icon
                  style={{ padding: 10 }}
                  size="xl"
                  as={ArrowLeftIcon}
                ></Icon>
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
            <CircleProgress progress={3} total={totalTickets}></CircleProgress>
          </Card>
        </Box>

        <Text style={styles.subTitle}>Total de registros {checkInCount}</Text>

        <ScrollView>
          {data.map((ticket: any) => (
            <Box style={[styles.card]}>
              <EventsCard data={ticket} dataStorage={dataStorage}></EventsCard>
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
