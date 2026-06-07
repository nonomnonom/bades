import { Trans } from '~/utils/i18n/badesI18n';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { FormatPreferencesSettings } from '@/settings/experience/components/FormatPreferencesSettings';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useColorScheme } from '@/ui/theme/hooks/useColorScheme';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title } from 'ui/display';
import { ColorSchemePicker } from 'ui/input';
import { Section } from 'ui/layout';

export const SettingsExperience = () => {
  const { colorScheme, setColorScheme } = useColorScheme();
  return (
    <SubMenuTopBarContainer
      title={`Tampilan`}
      links={[
        {
          children: <Trans>Pengguna</Trans>,
          href: getSettingsPath(SettingsPath.ProfilePage),
        },
        { children: <Trans>Tampilan</Trans> },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <H2Title title={`Tema Warna`} />
          <ColorSchemePicker
            value={colorScheme}
            onChange={setColorScheme}
            lightLabel={`Terang`}
            darkLabel={`Gelap`}
            systemLabel={`Ikuti sistem`}
          />
        </Section>

        <Section>
          <H2Title
            title={`Format`}
            description={`Atur format tanggal, waktu, angka, zona waktu, dan hari pertama kalender`}
          />
          <FormatPreferencesSettings />
        </Section>
        {/* Unified into FormatPreferencesSettings */}
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
