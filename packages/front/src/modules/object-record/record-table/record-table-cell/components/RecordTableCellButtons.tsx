import { styled } from '@linaria/react';
import { type IconComponent } from 'ui/display';
import { LightIconButtonGroup } from 'ui/input';
import { MOBILE_VIEWPORT, themeCssVariables } from 'ui/theme-constants';
import { AnimatedContainer } from 'ui/utilities';

const StyledButtonContainer = styled.div`
  border: 1px solid ${themeCssVariables.border.color.strong};
  @media (max-width: ${MOBILE_VIEWPORT}px) {
    position: relative;
    right: 7px;
  }
  border-radius: ${themeCssVariables.border.radius.sm};
  margin: ${themeCssVariables.spacing[1]};
`;

type RecordTableCellButtonsProps = {
  onClick?: () => void;
  Icon: IconComponent;
}[];

export const RecordTableCellButtons = ({
  buttons,
}: {
  buttons: RecordTableCellButtonsProps;
}) => {
  return (
    <AnimatedContainer>
      <StyledButtonContainer>
        <LightIconButtonGroup size="small" iconButtons={buttons} />
      </StyledButtonContainer>
    </AnimatedContainer>
  );
};
