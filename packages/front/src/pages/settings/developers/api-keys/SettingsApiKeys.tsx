import { Trans, useLingui } from '~/utils/i18n/badesI18n';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsApiKeysTable } from '@/settings/developers/components/SettingsApiKeysTable';
import { PlaygroundSetupForm } from '@/settings/playground/components/PlaygroundSetupForm';
import { StyledSettingsApiPlaygroundCoverImage } from '@/settings/playground/components/SettingsPlaygroundCoverImage';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
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

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  overflow: visible;
`;

export const SettingsApiKeys = () => {
  const { t } = useLingui();

  return (
    <SubMenuTopBarContainer
      title={t`API`}
      links={[
        {
          children: <Trans>Ruang Kerja</Trans>,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: <Trans>API</Trans> },
      ]}
    >
      <SettingsPageContainer>
        <StyledContainer>
          <Section>
            <H2Title
              title={t`Dokumentasi`}
              description={t`Coba playground API REST atau GraphQL kami.`}
            />
            <StyledSettingsApiPlaygroundCoverImage />
            <PlaygroundSetupForm />
          </Section>
        </StyledContainer>
        <StyledContainer>
          <Section>
            <H2Title
              title={t`Kunci API`}
              description={t`Kunci API aktif yang dibuat oleh Anda atau tim Anda.`}
            />
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
          </Section>
        </StyledContainer>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
