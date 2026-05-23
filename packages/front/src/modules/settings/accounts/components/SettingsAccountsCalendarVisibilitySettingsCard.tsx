import { styled } from '@linaria/react';

import { SettingsAccountsRadioSettingsCard } from '@/settings/accounts/components/SettingsAccountsRadioSettingsCard';
import { SettingsAccountsVisibilityIcon } from '@/settings/accounts/components/SettingsAccountsVisibilityIcon';
import { msg } from '~/utils/i18n/badesI18n';
import { CalendarChannelVisibility } from '~/generated/graphql';
import { themeCssVariables } from 'ui/theme-constants';

type SettingsAccountsEventVisibilitySettingsCardProps = {
  onChange: (nextValue: CalendarChannelVisibility) => void;
  value?: CalendarChannelVisibility;
};

const StyledCardMediaContainer = styled.div`
  > * {
    height: ${themeCssVariables.spacing[6]};
  }
`;

const eventSettingsVisibilityOptions = [
  {
    title: msg`Semua detail`,
    description: msg`Seluruh detail acara akan dibagikan ke tim Anda.`,
    value: CalendarChannelVisibility.SHARE_EVERYTHING,
    cardMedia: (
      <StyledCardMediaContainer>
        <SettingsAccountsVisibilityIcon subject="active" body="active" />
      </StyledCardMediaContainer>
    ),
  },
  {
    title: msg`Metadata`,
    description: msg`Hanya tanggal & peserta yang akan dibagikan ke tim Anda.`,
    value: CalendarChannelVisibility.METADATA,
    cardMedia: (
      <StyledCardMediaContainer>
        <SettingsAccountsVisibilityIcon subject="active" body="inactive" />
      </StyledCardMediaContainer>
    ),
  },
];

export const SettingsAccountsEventVisibilitySettingsCard = ({
  onChange,
  value = CalendarChannelVisibility.SHARE_EVERYTHING,
}: SettingsAccountsEventVisibilitySettingsCardProps) => (
  <SettingsAccountsRadioSettingsCard
    name="event-visibility"
    options={eventSettingsVisibilityOptions}
    value={value}
    onChange={onChange}
  />
);
