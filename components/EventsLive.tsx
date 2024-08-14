import * as React from "react";

import { Layout, StyleService, useStyleSheet } from "@ui-kitten/components";
import { Container, Content, Text } from "../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Image, TouchableOpacity } from "react-native";

const EventsLive = React.memo(({ item, index, navigation }: any) => {
  const styles = useStyleSheet(themedStyles);

  function eventFecha(fecha: string) {
    const date = new Date(fecha);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };

    const formattedDate = new Intl.DateTimeFormat("es-ES", options).format(
      date
    );

    return formattedDate;
  }

  return (
    <Container style={styles.container} useSafeArea={false}>
      <Content style={styles.content}>
        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.setItem("event_data", JSON.stringify(item));
            navigation.navigate("Dashboard");
          }}
          activeOpacity={0.7}
        >
          <Layout level="2" style={styles.item}>
            <Image source={{ uri: item.event_image }} style={styles.img} />
            <View>
              <Text style={styles.title}>{item.event_name}</Text>
              <View style={styles.times}>
                <Text
                  style={styles.subtitle}
                  status="platinum"
                  category="subhead"
                  children={`${item.EVENT_ORDERD_TICKETS} / ${item.EVENT_TOTAL_TICKETS}`}
                />
                <Layout style={styles.dot} />
                <Text
                  style={styles.subtitle}
                  status="platinum"
                  category="subhead"
                  children={eventFecha(item.event_start_datetime)}
                />
              </View>
            </View>
          </Layout>
        </TouchableOpacity>
      </Content>
    </Container>
  );
});

export default EventsLive;

const themedStyles = StyleService.create({
  title: {
    marginLeft: 7,
    fontWeight: "bold",
  },

  subtitle: {
    fontSize: 12,
    fontWeight: "700",
  },

  times: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 7,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 55,
    backgroundColor: "color-basic-1200",
    marginHorizontal: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
  },
  img: {
    height: 90,
    width: 117,
    borderRadius: 12,
    objectFit: "fill",
  },
  container: {
    flex: 1,
    paddingBottom: 0,
  },
  content: {
    paddingHorizontal: 8,
  },
});
