import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Circle } from "react-native-progress";

const CircleProgress = ({
  progress,
  total,
}: {
  progress: number;
  total: number;
}) => {
  const progressValue = progress && total && total !== 0 ? progress / total : 0;


  return (
    <View style={styles.container}>
      <Circle
        size={120}
        progress={progressValue}
        thickness={10}
        color="#007AFF"
        unfilledColor="#E0E0E0"
        borderWidth={0}
        showsText={true}
        textStyle={styles.progressText}
        formatText={() => `${progress}`}
      />
      <Text style={styles.totalText}>{`${progress}/${total}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  progressText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  totalText: {
    fontSize: 16,
    color: "gray",
    position: "absolute",
    bottom: 20,
  },
});

export default CircleProgress;
