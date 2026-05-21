import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { FormatPreferencesSettings } from '@/settings/experience/components/FormatPreferencesSettings';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useColorScheme } from '@/ui/theme/hooks/useColorScheme';
import { Trans, useLingui } from '@lingui/react/macro';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title } from 'ui/display';
import { ColorSchemePicker } from 'ui/input';
import { Section } from 'ui/layout';
import { LocalePicker } from '~/pages/settings/profile/appearance/components/LocalePicker';

export const SettingsExperience = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  const { t } = useLingui();

  return (
    <SubMenuTopBarContainer
      title={""Experience"}
      links={[
        {
          children: Pengguna,
          href: getSettingsPath(SettingsPath.ProfilePage),
        },
        { children: "Experience },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <H2Title title={""Appearance"} />
          <ColorSchemePicker
            value={colorScheme}
            onChange={setColorScheme}
            lightLabel={""Light"}
            darkLabel={""Dark"}
            systemLabel={""System settings"}
          />
        </Section>

        <Section>
          <H2Title
            title={"Bahasa"}
            description={""Select your preferred language"}
          />
          <LocalePicker />
        </Section>

        <Section>
          <H2Title
            title={""Formats"}
            description={""Configure date, time, number, timezone, and calendar start day"}
          />
          <FormatPreferencesSettings />
        </Section>
        {/* Unified into FormatPreferencesSettings */}
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
