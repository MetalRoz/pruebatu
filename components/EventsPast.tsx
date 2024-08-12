import * as React from "react";

import { Layout, StyleService, useStyleSheet } from "@ui-kitten/components";
import { Container, Content, Text } from "../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Image, TouchableOpacity } from "react-native";

const EventsPast = React.memo(({ item, index, navigation }: any) => {
  const styles = useStyleSheet(themedStyles);

  function eventFecha(fecha: any) {
    const fechaCompleta = fecha.substring(0, 10);
    let timeString = fecha.substring(10, 16);
    let timeNumber = Number(timeString.replace(":", ""));
    let formattedTime =
      timeNumber.toString().slice(0, -2) +
      ":" +
      timeNumber.toString().slice(-2);
    if (timeNumber > 12) {
      return `${fechaCompleta} ${formattedTime} PM`;
    } else {
      return `${fechaCompleta} ${formattedTime} AM`;
    }
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
            <Image
              source={require("../assets/evento.webp")}
              /* @ts-ignore */
              style={styles.img}
            />
            <View>
              <Text style={styles.title}>{item.event_name}</Text>
              <View style={styles.times}>
                <Text
                  status="platinum"
                  category="subhead"
                  children={`${item.EVENT_ORDERD_TICKETS} / ${item.EVENT_TOTAL_TICKETS}`}
                />
                <Layout style={styles.dot} />
                <Text
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

export default EventsPast;

const themedStyles = StyleService.create({
  title: {
    marginLeft: 7,
    fontWeight: "bold",
  },

  times: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 24,
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
    marginTop: 16,
    borderRadius: 12,
  },
  img: {
    height: 60,
    width: 60,
    borderRadius: 12,
  },
  container: {
    flex: 1,
    paddingBottom: 0,
  },
  content: {
    paddingHorizontal: 8,
  },
});
