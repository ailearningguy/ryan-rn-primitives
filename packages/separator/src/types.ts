import type { SlottableViewProps, ViewRef } from '@ryan-rn-primitives/types';

type RootProps = SlottableViewProps & {
  orientation?: 'horizontal' | 'vertical';
  decorative?: boolean;
};

type RootRef = ViewRef;

export type { RootProps, RootRef };
