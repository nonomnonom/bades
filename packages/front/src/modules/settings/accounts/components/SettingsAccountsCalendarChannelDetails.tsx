import { type CalendarChannel } from '@/accounts/types/CalendarChannel';
import { UPDATE_CALENDAR_CHANNEL } from '@/settings/accounts/graphql/mutations/updateCalendarChannel';
import { useMutation } from '@apollo/client/react';
import { SettingsAccountsEventVisibilitySettingsCard } from '@/settings/accounts/components/SettingsAccountsCalendarVisibilitySettingsCard';
import { SettingsOptionCardContentToggle } from '@/settings/components/SettingsOptions/SettingsOptionCardContentToggle';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { Section } from '@react-email/components';
import { H2Title, IconUserPlus } from 'ui/display';
import { Card } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';
import { type CalendarChannelVisibility } from '~/generated/graphql';

const StyledDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[6]};
`;

type SettingsAccountsCalendarChannelDetailsProps = {
  calendarChannel: Pick<
    CalendarChannel,
    'id' | 'visibility' | 'isContactAutoCreationEnabled' | 'isSyncEnabled'
  >;
};

export const SettingsAccountsCalendarChannelDetails = ({
  calendarChannel,
}: SettingsAccountsCalendarChannelDetailsProps) => {
  const [updateMetadataChannel] = useMutation(UPDATE_CALENDAR_CHANNEL);

  const updateChannel = (update: Record<string, unknown>) => {
    updateMetadataChannel({
      variables: { input: { id: calendarChannel.id, update } },
    });
  };

  const handleVisibilityChange = (value: CalendarChannelVisibility) => {
    updateChannel({ visibility: value });
  };

  const handleContactAutoCreationToggle = (value: boolean) => {
    updateChannel({ isContactAutoCreationEnabled: value });
  };

  return (
    <StyledDetailsContainer>
      <Section>
        <H2Title
          title={t`Visibilitas acara`}
          description={t`Tentukan apa yang akan terlihat oleh pengguna lain di Ruang Kerja Anda`}
        />
        <SettingsAccountsEventVisibilitySettingsCard
          value={calendarChannel.visibility}
          onChange={handleVisibilityChange}
        />
      </Section>
      <Section>
        <H2Title
          title={t`Pembuatan kontak otomatis`}
          description={t`Otomatis membuat kontak untuk orang yang berpartisipasi dalam acara kalender Anda.`}
        />
        <Card rounded>
          <SettingsOptionCardContentToggle
            Icon={IconUserPlus}
            title={t`Pembuatan otomatis`}
            description={t`Otomatis membuat kontak untuk orang-orang.`}
            checked={calendarChannel.isContactAutoCreationEnabled}
            onChange={() => {
              handleContactAutoCreationToggle(
                !calendarChannel.isContactAutoCreationEnabled,
              );
            }}
          />
        </Card>
      </Section>
    </StyledDetailsContainer>
  );
};
