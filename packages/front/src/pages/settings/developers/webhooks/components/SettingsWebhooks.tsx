import { Trans, useLingui } from '~/utils/i18n/badesI18n';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsWebhooksTable } from '@/settings/developers/components/SettingsWebhooksTable';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { styled } from '@linaria/react';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title, IconPlus } from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { MOBILE_VIEWPORT, themeCssVariables } from 'ui/theme-constants';

const StyledButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: ${themeCssVariables.spacing[2]};
  @media (max-width: ${MOBILE_VIEWPORT}px) {
    padding-top: ${themeCssVariables.spacing[5]};
  }
`;

const StyledContainer = styled.div<{ isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  overflow: hidden;
`;

export const SettingsWebhooks = () => {
  const isMobile = useIsMobile();
  const { t } = useLingui();

  return (
    <SubMenuTopBarContainer
      title={t`Webhook`}
      links={[
        {
          children: <Trans>Ruang Kerja</Trans>,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: <Trans>Webhook</Trans> },
      ]}
    >
      <SettingsPageContainer>
        <StyledContainer isMobile={isMobile}>
          <Section>
            <H2Title
              title={t`Webhook`}
              description={t`Tetapkan endpoint webhook untuk notifikasi pada peristiwa asynchronous.`}
            />
            <SettingsWebhooksTable />
            <StyledButtonContainer>
              <Button
                Icon={IconPlus}
                title={t`Buat Webhook`}
                size="small"
                variant="secondary"
                to={getSettingsPath(SettingsPath.NewWebhook)}
              />
            </StyledButtonContainer>
          </Section>
        </StyledContainer>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
