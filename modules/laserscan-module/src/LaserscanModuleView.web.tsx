import * as React from 'react';

import { LaserscanModuleViewProps } from './LaserscanModule.types';

export default function LaserscanModuleView(props: LaserscanModuleViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
