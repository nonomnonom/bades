import { Trans, useLingui } from '~/utils/i18n/badesI18n';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsApiKeysTable } from '@/settings/developers/components/SettingsApiKeysTable';
import { SettingsWebhooksTable } from '@/settings/developers/components/SettingsWebhooksTable';
import { PlaygroundSetupForm } from '@/settings/playground/components/PlaygroundSetupForm';
import { StyledSettingsApiPlaygroundCoverImage } from '@/settings/playground/components/SettingsPlaygroundCoverImage';
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

const StyledMainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[10]};
  min-height: 200px;
`;

const StyledSectionContainer = styled.div`
  flex-shrink: 0;
`;

const StyledContainer = styled.div<{ isMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  overflow: ${({ isMobile }) => (isMobile ? 'hidden' : 'visible')};
`;

export const SettingsApiWebhooks = () => {
  const isMobile = useIsMobile();
  const { t } = useLingui();

  return (
    <SubMenuTopBarContainer
      title={t`API & Webhook`}
      links={[
        {
          children: <Trans>Ruang Kerja</Trans>,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: <Trans>API & Webhook</Trans> },
      ]}
    >
      <SettingsPageContainer>
        <StyledMainContent>
          <StyledSectionContainer>
            <Section>
              <H2Title
                title={t`Dokumentasi`}
                description={t`Coba playground API REST atau GraphQL kami.`}
              />
              <StyledContainer>
                <StyledSettingsApiPlaygroundCoverImage />
                <PlaygroundSetupForm />
              </StyledContainer>
            </Section>
          </StyledSectionContainer>

          <StyledSectionContainer>
            <Section>
              <H2Title
                title={t`Kunci API`}
                description={t`Kunci API aktif yang dibuat oleh Anda atau tim Anda.`}
              />
              <StyledContainer isMobile={isMobile}>
                <SettingsApiKeysTable />
                <StyledButtonContainer>
                  <Button
                    Icon={IconPlus}
                    title={t`Buat Kunci API`}
                    size="small"
                    variant="secondary"
                    to={getSettingsPath(SettingsPath.NewApiKey)}
                  />
                </StyledButtonContainer>
              </StyledContainer>
            </Section>
          </StyledSectionContainer>

          <StyledSectionContainer>
            <Section>
              <H2Title
                title={t`Webhook`}
                description={t`Tetapkan endpoint webhook untuk notifikasi pada peristiwa asynchronous.`}
              />
              <StyledContainer isMobile={isMobile}>
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
              </StyledContainer>
            </Section>
          </StyledSectionContainer>
        </StyledMainContent>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
