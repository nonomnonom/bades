import { styled } from '@linaria/react';

import { EmptyInboxPlaceholder } from '@/activities/emails/components/EmptyInboxPlaceholder';
import { themeCssVariables } from 'ui/theme-constants';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[6]};
  height: 100%;
  overflow: auto;
  padding: ${themeCssVariables.spacing[6]} ${themeCssVariables.spacing[6]}
    ${themeCssVariables.spacing[2]};
`;

export const EmailsCard = () => {
  return (
    <StyledContainer>
      <EmptyInboxPlaceholder />
    </StyledContainer>
  );
};
