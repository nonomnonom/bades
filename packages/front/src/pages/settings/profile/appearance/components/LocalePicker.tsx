import { styled } from '@linaria/react';

import { Select } from '@/ui/input/components/Select';
import { themeCssVariables } from 'ui/theme-constants';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
`;

export const LocalePicker = () => {
  return (
    <StyledContainer>
      <Select
        dropdownId="preferred-locale"
        dropdownWidthAuto
        fullWidth
        value="id-ID"
        options={[
          {
            label: "Indonesia",
            value: "id-ID" as const,
          },
        ]}
        onChange={() => {}}
      />
    </StyledContainer>
  );
};