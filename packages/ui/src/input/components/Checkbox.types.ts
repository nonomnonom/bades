import * as React from 'react';

export enum CheckboxVariant {
  Primary = 'primary',
  Secondary = 'secondary',
  Tertiary = 'tertiary',
}

export enum CheckboxShape {
  Squared = 'squared',
  Rounded = 'rounded',
}

export enum CheckboxSize {
  Large = 'large',
  Small = 'small',
}

export enum CheckboxAccent {
  Blue = 'blue',
  Orange = 'orange',
}

export type CheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  hoverable?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckedChange?: (value: boolean) => void;
  variant?: CheckboxVariant;
  size?: CheckboxSize;
  shape?: CheckboxShape;
  className?: string;
  disabled?: boolean;
  accent?: CheckboxAccent;
};

export type InputProps = {
  checkboxSize: CheckboxSize;
  variant: CheckboxVariant;
  accent?: CheckboxAccent;
  indeterminate?: boolean;
  hoverable?: boolean;
  shape?: CheckboxShape;
  isChecked?: boolean;
  disabled?: boolean;
};