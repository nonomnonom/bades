import { styled } from '@linaria/react';
import { type ReactNode } from 'react';

import { isNonEmptyString } from '@sniptt/guards';
import { OverflowingTextWithTooltip } from '@ui/display/tooltip/OverflowingTextWithTooltip';
import { themeCssVariables } from '@ui/theme-constants';
import { isDefined } from 'shared/utils';

import {
  ChipAccent,
  type ChipProps,
  ChipSize,
  ChipVariant,
} from './Chip.types';

// Re-export types for backwards compatibility
export { ChipSize, ChipAccent, ChipVariant };
export type { ChipProps };

const StyledDiv = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
`;

const StyledContainer = styled.div<
  Pick<
    ChipProps,
    | 'accent'
    | 'clickable'
    | 'disabled'
    | 'isBold'
    | 'maxWidth'
    | 'size'
    | 'variant'
  >
>`
  --chip-horizontal-padding: ${themeCssVariables.spacing[1]};
  --chip-vertical-padding: ${themeCssVariables.spacing[1]};

  text-decoration: none;
  align-items: center;

  color: ${({ accent, disabled }) =>
    disabled
      ? themeCssVariables.font.color.light
      : accent === ChipAccent.TextPrimary
        ? themeCssVariables.font.color.primary
        : themeCssVariables.font.color.secondary};

  cursor: ${({ clickable, disabled, variant }) =>
    variant === ChipVariant.Transparent
      ? 'inherit'
      : clickable
        ? 'pointer'
        : disabled
          ? 'not-allowed'
          : 'inherit'};

  display: inline-flex;
  justify-content: flex-start;
  gap: ${themeCssVariables.spacing[1]};
  height: ${({ size }) =>
    size === ChipSize.Large
      ? themeCssVariables.spacing[4]
      : themeCssVariables.spacing[3]};
  max-width: ${({ maxWidth }) =>
    maxWidth
      ? `calc(${maxWidth}px - 2 * var(--chip-horizontal-padding))`
      : '100%'};
  overflow: hidden;
  padding: var(--chip-vertical-padding) var(--chip-horizontal-padding);
  user-select: none;

  font-weight: ${({ accent, isBold }) =>
    isBold || accent === ChipAccent.TextSecondary
      ? themeCssVariables.font.weight.medium
      : 'inherit'};

  &:hover {
    background-color: ${({ variant, disabled }) =>
      variant === ChipVariant.Regular && !disabled
        ? themeCssVariables.background.transparent.light
        : variant === ChipVariant.Highlighted
          ? themeCssVariables.background.transparent.medium
          : variant === ChipVariant.Static
            ? themeCssVariables.background.transparent.light
            : 'inherit'};
  }

  &:active {
    background-color: ${({ disabled, variant }) =>
      variant === ChipVariant.Regular && !disabled
        ? themeCssVariables.background.transparent.medium
        : variant === ChipVariant.Highlighted
          ? themeCssVariables.background.transparent.strong
          : variant === ChipVariant.Static
            ? themeCssVariables.background.transparent.light
            : 'inherit'};
  }

  background-color: ${({ variant }) =>
    variant === ChipVariant.Highlighted || variant === ChipVariant.Static
      ? themeCssVariables.background.transparent.light
      : 'inherit'};

  border: none;

  border-radius: ${themeCssVariables.border.radius.sm};

  & > svg {
    flex-shrink: 0;
  }

  padding-left: ${({ variant }) =>
    variant === ChipVariant.Transparent
      ? themeCssVariables.spacing[0]
      : 'var(--chip-horizontal-padding)'};
`;

const StyledRightComponentDivider = styled.div`
  align-self: stretch;
  border-left: 1px solid ${themeCssVariables.border.color.light};
`;

type RightComponentRendererProps = {
  rightComponent: (() => ReactNode) | ReactNode | null;
  rightComponentDivider?: boolean;
};

const RightComponentRenderer = ({
  rightComponent,
  rightComponentDivider,
}: RightComponentRendererProps) => {
  if (!rightComponent) {
    return null;
  }

  const rendered =
    typeof rightComponent === 'function' ? rightComponent() : rightComponent;

  if (rightComponentDivider === true) {
    return (
      <>
        <StyledRightComponentDivider />
        {rendered}
      </>
    );
  }

  return <>{rendered}</>;
};

export const Chip = ({
  size = ChipSize.Small,
  label,
  tooltipLabel,
  alwaysShowTooltip = false,
  isLabelHidden = false,
  isBold = false,
  disabled = false,
  clickable = true,
  variant = ChipVariant.Regular,
  leftComponent = null,
  rightComponent = null,
  rightComponentDivider = false,
  accent = ChipAccent.TextPrimary,
  className,
  maxWidth,
  forceEmptyText = false,
  emptyLabel = 'Tanpa judul',
}: ChipProps) => {
  return (
    <StyledContainer
      data-testid="chip"
      accent={accent}
      clickable={clickable}
      disabled={disabled}
      isBold={isBold}
      size={size}
      variant={variant}
      className={className}
      maxWidth={maxWidth}
    >
      {leftComponent}
      {!isLabelHidden && isDefined(label) && isNonEmptyString(label) ? (
        <OverflowingTextWithTooltip
          size={size}
          text={label}
          tooltipContent={tooltipLabel}
          alwaysShowTooltip={alwaysShowTooltip}
        />
      ) : !forceEmptyText && !isLabelHidden ? (
        <StyledDiv>{emptyLabel}</StyledDiv>
      ) : (
        ''
      )}
      <RightComponentRenderer
        rightComponent={rightComponent}
        rightComponentDivider={rightComponentDivider}
      />
    </StyledContainer>
  );
};
