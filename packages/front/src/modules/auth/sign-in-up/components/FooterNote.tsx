import { styled } from '@linaria/react';
import { Trans } from '~/utils/i18n/badesI18n';

import { useWorkspaceBypass } from '@/auth/sign-in-up/hooks/useWorkspaceBypass';
import { useIsCurrentLocationOnAWorkspace } from '@/domain-manager/hooks/useIsCurrentLocationOnAWorkspace';
import { themeCssVariables } from 'ui/theme-constants';

const StyledCopyContainer = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  max-width: 280px;
  text-align: center;

  & > a {
    color: ${themeCssVariables.font.color.tertiary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const StyledLinksContainer = styled.div`
  align-items: center;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  flex-wrap: nowrap;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[2]};
  justify-content: center;
  max-width: 100%;
  text-align: center;
  white-space: nowrap;

  & > a,
  & > button {
    background: none;
    border: none;
    color: ${themeCssVariables.font.color.tertiary};
    cursor: pointer;
    font: inherit;
    padding: 0;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const StyledSeparator = styled.span`
  color: ${themeCssVariables.font.color.tertiary};
`;

export const FooterNote = () => {
  const { isOnAWorkspace } = useIsCurrentLocationOnAWorkspace();

  const { shouldOfferBypass, shouldUseBypass, enableBypass } =
    useWorkspaceBypass();

  if (!isOnAWorkspace) {
    return (
      <StyledCopyContainer>
        <Trans>Dengan menggunakan Bades.id, Anda menyetujui</Trans>{' '}
        <a
          href="https://bades.id/kebijakan"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Trans>Ketentuan Layanan</Trans>
        </a>{' '}
        <Trans>dan</Trans>{' '}
        <a
          href="https://bades.id/privasi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Trans>Kebijakan Privasi</Trans>
        </a>
        .
      </StyledCopyContainer>
    );
  }

  return (
    <StyledLinksContainer>
      {shouldOfferBypass && !shouldUseBypass && (
        <>
          <button type="button" onClick={enableBypass}>
            "Bypass SSO
          </button>
          <StyledSeparator>•</StyledSeparator>
        </>
      )}
      <a
        href="https://bades.id/privasi"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Trans>Kebijakan Privasi</Trans>
      </a>
      <StyledSeparator>•</StyledSeparator>
      <a
        href="https://bades.id/ketentuan"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Trans>Ketentuan Layanan</Trans>
      </a>
    </StyledLinksContainer>
  );
};
