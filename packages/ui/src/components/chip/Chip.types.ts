import { type ReactNode } from 'react';

export enum ChipSize {
  Large = 'large',
  Small = 'small',
}

export enum ChipAccent {
  TextPrimary = 'text-primary',
  TextSecondary = 'text-secondary',
}

export enum ChipVariant {
  Highlighted = 'highlighted',
  Regular = 'regular',
  Transparent = 'transparent',
  Rounded = 'rounded',
  Static = 'static',
}

export type ChipProps = {
  size?: ChipSize;
  disabled?: boolean;
  clickable?: boolean;
  label: string;
  tooltipLabel?: string;
  alwaysShowTooltip?: boolean;
  isLabelHidden?: boolean;
  isBold?: boolean;
  maxWidth?: number;
  variant?: ChipVariant;
  accent?: ChipAccent;
  leftComponent?: ReactNode | null;
  rightComponent?: (() => ReactNode) | ReactNode | null;
  rightComponentDivider?: boolean;
  className?: string;
  forceEmptyText?: boolean;
  emptyLabel?: string;
};
