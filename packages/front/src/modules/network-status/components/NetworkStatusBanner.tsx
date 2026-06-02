import { styled } from '@linaria/react';
import { themeCssVariables } from 'ui/theme-constants';

const StyledBanner = styled.div`
  background-color: ${themeCssVariables.color.amber};
  bottom: 0;
  color: ${themeCssVariables.color.gray12};
  font-size: 14px;
  font-weight: 500;
  left: 0;
  padding: 8px 16px;
  position: fixed;
  right: 0;
  text-align: center;
  z-index: 9999;
`;

export const NetworkStatusBanner = () => {
  return (
    <StyledBanner>
      Anda sedang offline. Beberapa fitur mungkin tidak tersedia.
    </StyledBanner>
  );
};
