import { t } from '~/utils/i18n/badesI18n';
import { SettingsCard } from '@/settings/components/SettingsCard';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsLabContent } from '@/settings/lab/components/SettingsLabContent';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { styled } from '@linaria/react';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title, IconTransform } from 'ui/display';
import { Section } from 'ui/layout';
import { useContext } from 'react';
import { ThemeContext } from 'ui/theme-constants';
const StyledCardLink = styled.a`
  text-decoration: none;
`;

export const SettingsUpdates = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <SubMenuTopBarContainer
      title={t`Pembaruan`}
      links={[
        {
          children: t`Lainnya`,
          href: getSettingsPath(SettingsPath.Updates),
        },
        { children: t`Pembaruan` },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <H2Title
            title={t`Rilis`}
            description={t`Lihat rilis terbaru kami`}
          />
          <StyledCardLink
            href="https://bades.id/releases"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SettingsCard
              Icon={
                <IconTransform
                  size={theme.icon.size.md}
                  stroke={theme.icon.stroke.sm}
                />
              }
              title={t`Baca catatan perubahan`}
            />
          </StyledCardLink>
        </Section>

        <Section>
          <H2Title
            title={t`Akses awal`}
            description={t`Coba fitur-fitur mendatang kami. Fitur ini masih dalam tahap beta. Laporkan masalah yang Anda temukan.`}
          />
          <SettingsLabContent />
        </Section>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
