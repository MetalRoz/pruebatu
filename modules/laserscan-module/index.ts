import {
  NativeModulesProxy,
  EventEmitter,
  Subscription,
} from "expo-modules-core";
import LaserscanModule from "./src/LaserscanModule";
import LaserscanModuleView from "./src/LaserscanModuleView";
import {
  ChangeEventPayload,
  LaserscanModuleViewProps,
} from "./src/LaserscanModule.types";

// Get the native constant value.
export const PI = LaserscanModule.PI;

export function hello(): string {
  return LaserscanModule.hello();
}

export function startScan() {
  return LaserscanModule.startScan();
}

export function stopScan() {
  return LaserscanModule.stopScan();
}

export function initializeScanner() {
  return LaserscanModule.initializeScanner();
}

export async function setValueAsync(value: string) {
  return await LaserscanModule.setValueAsync(value);
}

const emitter = new EventEmitter(
  LaserscanModule ?? NativeModulesProxy.LaserscanModule
);

export function addScanSuccessListener(
  listener: (event: { data: string }) => void
): Subscription {
  return emitter.addListener("onScanSuccess", listener);
}

export function addScanFailureListener(
  listener: (event: { error: string }) => void
): Subscription {
  return emitter.addListener("onScanFailed", listener);
}

export { LaserscanModuleView, LaserscanModuleViewProps, ChangeEventPayload };
