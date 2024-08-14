import * as React from "react";
import { Image } from "react-native";
import { StyleService, useStyleSheet } from "@ui-kitten/components";

import { Text, VStack, HStack } from "../components";

import _ from "lodash";

const EventsCard = ({ data, dataStorage }: any) => {
  const styles = useStyleSheet(themedStyles);
  const colors = ["#00C48C", "#FFCF5C", "#FFA26B", "#FF647C", "#FBF0EA"];
  let colours = _.shuffle(colors);

  return (
    <HStack
      style={[styles.container, { backgroundColor: colours.pop() }]}
      justify="flex-start"
    >
      <Image source={{ uri: dataStorage.event_image }} style={styles.image} />
      <VStack ml={16}>
        <Text category="callout" marginBottom={8}>
          {data.TICKE_TITLE}
        </Text>
        <Text category="body" marginBottom={10}>
          <Text category="h7">{data.CHECKIN_COUNT}</Text>/
          {data.TOTAL_TICKETS} Checked in
        </Text>
      </VStack>
    </HStack>
  );
};

export default EventsCard;

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    marginBottom: 16,

    borderRadius: 12,
  },
  image: {
    height: 90,
    width: 117,
    borderRadius: 12,
    objectFit: "fill",
  },
  progressBar: {
    height: 8,
  },
});
