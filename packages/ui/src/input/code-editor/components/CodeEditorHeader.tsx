import { styled } from '@linaria/react';

import { themeCssVariables } from '@ui/theme-constants';

const StyledEditorHeader = styled.div`
  align-items: center;
  background-color: ${themeCssVariables.background.transparent.lighter};
  color: ${themeCssVariables.font.color.tertiary};
  font-weight: ${themeCssVariables.font.weight.medium};
  display: flex;
  height: ${themeCssVariables.spacing[10]};
  padding: 0 ${themeCssVariables.spacing[2]};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-top-left-radius: ${themeCssVariables.border.radius.sm};
  border-top-right-radius: ${themeCssVariables.border.radius.sm};
  justify-content: space-between;
`;

const StyledElementContainer = styled.div`
  align-content: flex-end;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

export type CoreEditorHeaderProps = {
  title?: string;
  leftNodes?: React.ReactNode[];
  rightNodes?: React.ReactNode[];
};

export const CoreEditorHeader = ({
  title,
  leftNodes,
  rightNodes,
}: CoreEditorHeaderProps) => {
  return (
    <StyledEditorHeader>
      <StyledElementContainer>
        {leftNodes?.map((leftButton, index) => (
          <div key={`left-node-${index}`}>{leftButton}</div>
        ))}
        {title}
      </StyledElementContainer>
      <StyledElementContainer>
        {rightNodes?.map((rightButton, index) => (
          <div key={`right-node-${index}`}>{rightButton}</div>
        ))}
      </StyledElementContainer>
    </StyledEditorHeader>
  );
};
