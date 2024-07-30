import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import {
  CheckCircleIcon,
  XCircleIcon,
  TicketCheckIcon,
} from "lucide-react-native";
import { Icon } from "@gluestack-ui/themed";

function BottomSheet({ isOpen, toggleSheet, duration = 500, children }: any) {
  const colorScheme = useColorScheme();
  const height = useSharedValue(0);
  const progress = useDerivedValue(() =>
    withTiming(isOpen.value ? 0 : 1, { duration })
  );

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: progress.value * 2 * height.value }],
  }));

  const backgroundColorSheetStyle = {
    backgroundColor: colorScheme === "light" ? "#f8f9ff" : "#272B3C",
  };

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    zIndex: isOpen.value
      ? 1
      : withDelay(duration, withTiming(-1, { duration: 0 })),
  }));

  return (
    <>
      <Animated.View style={[sheetStyles.backdrop, backdropStyle]}>
        <TouchableOpacity style={styles.flex} onPress={toggleSheet} />
      </Animated.View>
      <Animated.View
        onLayout={(e) => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={[sheetStyles.sheet, sheetStyle, backgroundColorSheetStyle]}
      >
        {children}
      </Animated.View>
    </>
  );
}

export default function ModalCheckIn({ data, isOpen, onClose }: any) {
  const colorScheme = useColorScheme();
  const isSheetOpen = useSharedValue(isOpen);

  const toggleSheet = () => {
    isSheetOpen.value = !isSheetOpen.value;
    if (!isSheetOpen.value) {
      onClose();
      isSheetOpen.value = false;
    }
  };

  useEffect(() => {
    isSheetOpen.value = isOpen;
  }, [isOpen]);

  const contentStyle = {
    color: colorScheme === "light" ? "#001a72" : "#f8f9ff",
    textDecorationColor: colorScheme === "light" ? "#001a72" : "#f8f9ff",
    fontSize: 20,
  };

  return (
    <SafeAreaView style={styles.container}>
      <BottomSheet isOpen={isSheetOpen} toggleSheet={toggleSheet}>
        {data &&
          data.message &&
          (data.message.includes(
            "Este ticket ya se encuentra en el evento, acceso no permitido"
          ) ? (
            <Icon as={XCircleIcon} size={80} color="$red400" />
          ) : data.message.includes("Verificación exitosa") ? (
            <Icon as={CheckCircleIcon} size={80} color="$green600" />
          ) : (
            <Icon as={XCircleIcon} size={80} color="$red400" />
          ))}
        <Animated.Text style={contentStyle}>{data.message}</Animated.Text>
        <Animated.Text>
          Este modal se cerrará automáticamente en 3 segundos...
        </Animated.Text>
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    height: 250,
  },
  buttonContainer: {
    marginTop: 16,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  toggleButton: {
    backgroundColor: "#b58df1",
    padding: 12,
    borderRadius: 48,
    display: "none",
  },
  toggleButtonText: {
    color: "white",
    padding: 3,
  },
  safeArea: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  bottomSheetButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 2,
  },
  bottomSheetButtonText: {
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

const sheetStyles = StyleSheet.create({
  sheet: {
    padding: 16,
    height: "48%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    zIndex: 2,
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
});
