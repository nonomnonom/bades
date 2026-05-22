import { styled } from '@linaria/react';
import { useContext } from 'react';

import { SettingsCard } from '@/settings/components/SettingsCard';
import { useLingui } from '~/utils/i18n/badesI18n';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title, IconCalendarEvent, IconMailCog } from 'ui/display';
import { Section } from 'ui/layout';
import { UndecoratedLink } from 'ui/navigation';
import {
  MOBILE_VIEWPORT,
  ThemeContext,
  themeCssVariables,
} from 'ui/theme-constants';

const StyledCardsContainer = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[4]};
  margin-top: ${themeCssVariables.spacing[6]};

  @media (max-width: ${MOBILE_VIEWPORT}pxF) {
    flex-direction: column;
  }
`;

export const SettingsAccountsSettingsSection = () => {
  const { theme } = useContext(ThemeContext);
  const { t } = useLingui();
  return (
    <Section>
      <H2Title
        title={t`Pengaturan`}
        description={t`Atur email dan pengaturan kalender Anda.`}
      />
      <StyledCardsContainer>
        <UndecoratedLink to={getSettingsPath(SettingsPath.AccountsEmails)}>
          <SettingsCard
            Icon={
              <IconMailCog
                size={theme.icon.size.lg}
                stroke={theme.icon.stroke.sm}
              />
            }
            title={t`Email`}
            description={t`Atur visibilitas email, kelola daftar blokir, dan lainnya.`}
          />
        </UndecoratedLink>
        <UndecoratedLink to={getSettingsPath(SettingsPath.AccountsCalendars)}>
          <SettingsCard
            Icon={
              <IconCalendarEvent
                size={theme.icon.size.lg}
                stroke={theme.icon.stroke.sm}
              />
            }
            title={t`Kalender`}
            description={t`Atur dan sesuaikan preferensi kalender Anda.`}
          />
        </UndecoratedLink>
      </StyledCardsContainer>
    </Section>
  );
};
