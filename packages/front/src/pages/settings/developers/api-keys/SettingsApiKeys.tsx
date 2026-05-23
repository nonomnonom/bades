import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsApiKeysTable } from '@/settings/developers/components/SettingsApiKeysTable';
import { PlaygroundSetupForm } from '@/settings/playground/components/PlaygroundSetupForm';
import { StyledSettingsApiPlaygroundCoverImage } from '@/settings/playground/components/SettingsPlaygroundCoverImage';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { styled } from '@linaria/react';
import { Trans, useLingui } from '@lingui/react/macro';
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
      title={""APIs"}
      links={[
        {
          children: Ruang kerja,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: "APIs },
      ]}
    >
      <SettingsPageContainer>
        <StyledContainer>
          <Section>
            <H2Title
              title={""Documentation"}
              description={""Try our REST or GraphQL API playgrounds."}
            />
            <StyledSettingsApiPlaygroundCoverImage />
            <PlaygroundSetupForm />
          </Section>
        </StyledContainer>
        <StyledContainer>
          <Section>
            <H2Title
              title={""API keys"}
              description={"Kunci API aktif yang dibuat oleh Anda atau tim Anda."}
            />
            <SettingsApiKeysTable />
            <StyledButtonContainer>
              <Button
                Icon={IconPlus}
                title={""Create API key"}
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
