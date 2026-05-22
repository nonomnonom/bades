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
      title={t`Tampilan`}
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
          <H2Title title={t`Tema Warna`} />
          <ColorSchemePicker
            value={colorScheme}
            onChange={setColorScheme}
            lightLabel={t`Terang`}
            darkLabel={t`Gelap`}
            systemLabel={t`Ikuti sistem`}
          />
        </Section>

        <Section>
          <H2Title
            title={t`Bahasa`}
            description={t`Pilih bahasa yang Anda gunakan`}
          />
          <LocalePicker />
        </Section>

        <Section>
          <H2Title
            title={t`Format`}
            description={t`Atur format tanggal, waktu, angka, zona waktu, dan hari pertama kalender`}
          />
          <FormatPreferencesSettings />
        </Section>
        {/* Unified into FormatPreferencesSettings */}
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
