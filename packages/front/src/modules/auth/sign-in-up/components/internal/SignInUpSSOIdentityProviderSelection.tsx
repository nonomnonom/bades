/* @license Enterprise */

import { useSSO } from '@/auth/sign-in-up/hooks/useSSO';
import { guessSSOIdentityProviderIconByUrl } from '@/settings/security/utils/guessSSOIdentityProviderIconByUrl';
import { styled } from '@linaria/react';

import { workspaceAuthProvidersState } from '@/workspace/states/workspaceAuthProvidersState';
import React from 'react';
import { isDefined } from 'shared/utils';
import { HorizontalSeparator } from 'ui/display';
import { MainButton } from 'ui/input';
import { themeCssVariables } from 'ui/theme-constants';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

const StyledContentContainer = styled.div`
  margin-bottom: ${themeCssVariables.spacing[8]};
  margin-top: ${themeCssVariables.spacing[4]};
`;

export const SignInUpSSOIdentityProviderSelection = () => {
  const workspaceAuthProviders = useAtomStateValue(workspaceAuthProvidersState);

  const { redirectToSSOLoginPage } = useSSO();

  return (
    <>
      <StyledContentContainer>
        {isDefined(workspaceAuthProviders?.sso) &&
          workspaceAuthProviders?.sso.map((idp) => (
            <React.Fragment key={idp.id}>
              <MainButton
                title={idp.name}
                onClick={() => redirectToSSOLoginPage(idp.id)}
                Icon={guessSSOIdentityProviderIconByUrl(idp.issuer)}
                fullWidth
              />
              <HorizontalSeparator visible={false} />
            </React.Fragment>
          ))}
      </StyledContentContainer>
    </>
  );
};
