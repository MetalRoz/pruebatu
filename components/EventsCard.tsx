import * as React from "react";
import { View, Image, StyleSheet, ImageRequireSource } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useLayout } from "../hooks";
import {
  Layout,
  StyleService,
  useStyleSheet,
  useTheme,
  TopNavigation,
} from "@ui-kitten/components";

import {
  Container,
  Content,
  Text,
  NavigationAction,
  VStack,
  HStack,
} from "../components";
import Images from "../assets/images";
import _ from "lodash";
import ProgressBar from "../components/ProgressBar";

const EventsCard = ({ data }: any) => {
  const theme = useTheme();
  const { goBack } = useNavigation();
  const { height, width, top, bottom } = useLayout();
  const styles = useStyleSheet(themedStyles);
  const colors = ["#00C48C", "#FFCF5C", "#FFA26B", "#FF647C", "#FBF0EA"];
  let colours = _.shuffle(colors);

  return (
    <HStack
      style={[styles.container, { backgroundColor: colours.pop() }]}
      justify="flex-start"
    >
      <Image
        source={require("../assets/evento.webp")}
        //@ts-ignore
        style={styles.image}
      />
      <VStack ml={16}>
        <Text category="callout" marginBottom={8}>
          {data.TICKE_TITLE}
        </Text>
        <Text category="body" marginBottom={10}>
          <Text category="h7">{data.NUMBER_OF_CHACKIN}</Text>/
          {data.NUMBER_OF_ORDER} Checked in
        </Text>
        {/* <ProgressBar
          progress={0 / data.NUMBER_OF_ORDER}
          style={styles.progressBar}
          styleBar={styles.progressBar}
        /> */}
      </VStack>
    </HStack>
  );
};

export default EventsCard;

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  progressBar: {
    height: 8,
  },
});
