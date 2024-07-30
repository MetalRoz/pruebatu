import * as React from "react";

import { Layout, StyleService, useStyleSheet } from "@ui-kitten/components";
import { Container, Content, Text } from "../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Image, TouchableOpacity } from "react-native";

const EventsLive = React.memo(({ item, index, navigation }: any) => {
  const styles = useStyleSheet(themedStyles);

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
                  children={`${item.EVENT_ORDERD_TICKETS} ordenados`}
                />
                <Layout style={styles.dot} />
                <Text
                  status="platinum"
                  category="subhead"
                  children={`${item.EVENT_TOTAL_TICKETS} total`}
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
