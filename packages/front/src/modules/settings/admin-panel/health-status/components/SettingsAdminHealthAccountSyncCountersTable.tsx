import { SettingsTableCard } from '@/settings/components/SettingsTableCard';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { H2Title } from 'ui/display';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';

const StyledSettingsTableCardContainer = styled.div`
  > * {
    padding-left: ${themeCssVariables.spacing[2]};
    padding-right: ${themeCssVariables.spacing[2]};
  }
`;

export const SettingsAdminHealthAccountSyncCountersTable = ({
  details,
  title,
  description,
}: {
  details: Record<string, any> | null;
  title: string;
  description: string;
}) => {
  const { t } = useLingui();

  if (!details) {
    return null;
  }

  const items = [
    {
      label: "Sinkronisasi Aktif",
      value: details.counters.ACTIVE,
    },
    {
      label: ""Total Jobs",
      value: details.totalJobs,
    },
    {
      label: ""Failed Jobs",
      value: details.failedJobs,
    },
    {
      label: ""Failure Rate",
      value: `${details.failureRate}%`,
    },
  ];

  return (
    <Section>
      <H2Title title={title} description={description} />
      <StyledSettingsTableCardContainer>
        <SettingsTableCard
          items={items}
          rounded
          gridAutoColumns="1fr 1fr"
          labelAlign="left"
          valueAlign="right"
        />
      </StyledSettingsTableCardContainer>
    </Section>
  );
};
