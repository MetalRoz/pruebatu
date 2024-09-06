import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { LaserscanModuleViewProps } from './LaserscanModule.types';

const NativeView: React.ComponentType<LaserscanModuleViewProps> =
  requireNativeViewManager('LaserscanModule');

export default function LaserscanModuleView(props: LaserscanModuleViewProps) {
  return <NativeView {...props} />;
}
