import { styled } from '@linaria/react';
import { type IconComponent } from '@ui/display';
import {
  type FunctionComponent,
  type MouseEvent,
  type ReactElement,
} from 'react';

import { LightIconButton, type LightIconButtonProps } from './LightIconButton';

const StyledLightIconButtonGroupContainer = styled.div`
  display: inline-flex;
  gap: 2px;
`;

export type LightIconButtonGroupProps = Pick<
  LightIconButtonProps,
  'className' | 'size'
> & {
  iconButtons: {
    Wrapper?: FunctionComponent<{ iconButton: ReactElement }>;
    Icon: IconComponent;
    accent?: LightIconButtonProps['accent'];
    onClick?: (event: MouseEvent<any>) => void;
    disabled?: boolean;
    ariaLabel?: string;
    dataTestId?: string;
  }[];
};

export const LightIconButtonGroup = ({
  iconButtons,
  size,
  className,
}: LightIconButtonGroupProps) => (
  <StyledLightIconButtonGroupContainer className={className}>
    {iconButtons.map((iconButtonItem, index) => {
      const { Wrapper, Icon, accent, onClick, ariaLabel, dataTestId } =
        iconButtonItem;
      const iconButtonKey =
        Icon.displayName || Icon.name || `light-icon-${index}`;
      const iconButton = (
        <LightIconButton
          key={iconButtonKey}
          Icon={Icon}
          accent={accent}
          disabled={!onClick}
          onClick={onClick}
          size={size}
          aria-label={ariaLabel}
          testId={dataTestId}
        />
      );

      return Wrapper ? (
        <Wrapper key={`wrapper-${iconButtonKey}`} iconButton={iconButton} />
      ) : (
        iconButton
      );
    })}
  </StyledLightIconButtonGroupContainer>
);
