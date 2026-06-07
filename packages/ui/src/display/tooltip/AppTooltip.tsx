import { css } from '@linaria/core';
import { Tooltip } from 'react-tooltip';
import { themeCssVariables } from '@ui/theme-constants';

import {
  TooltipDelay,
  TooltipPosition,
  type AppTooltipProps,
} from './AppTooltip.types';

const getDelayInMis = (delay: TooltipDelay) => {
  switch (delay) {
    case TooltipDelay.noDelay:
      return 0;
    case TooltipDelay.shortDelay:
      return 300;
    case TooltipDelay.mediumDelay:
      return 500;
    case TooltipDelay.longDelay:
      return 1000;
  }
};

const appTooltipClass = css`
  backdrop-filter: ${themeCssVariables.blur.strong};
  background-color: ${themeCssVariables.color.transparent.gray11};
  border-radius: ${themeCssVariables.border.radius.sm};
  box-shadow: ${themeCssVariables.boxShadow.light};
  color: ${themeCssVariables.grayScale.gray1};
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${themeCssVariables.font.weight.regular};
  overflow: visible;
  padding: ${themeCssVariables.spacing[2]};
  word-break: break-word;
  z-index: ${themeCssVariables.lastLayerZIndex};
`;

export const AppTooltip = ({
  anchorSelect,
  className,
  content,
  hidden = false,
  noArrow,
  offset,
  delay = TooltipDelay.mediumDelay,
  place,
  positionStrategy,
  children,
  clickable,
  width,
  isOpen,
}: AppTooltipProps) => {
  return (
    <Tooltip
      anchorSelect={anchorSelect}
      className={`${appTooltipClass}${className ? ` ${className}` : ''}`}
      content={content}
      delayShow={getDelayInMis(delay)}
      delayHide={20}
      hidden={hidden}
      noArrow={noArrow}
      offset={offset}
      place={place}
      positionStrategy={positionStrategy}
      clickable={clickable}
      isOpen={isOpen}
      style={{ maxWidth: width ?? '40%' }}
    >
      {children}
    </Tooltip>
  );
};
