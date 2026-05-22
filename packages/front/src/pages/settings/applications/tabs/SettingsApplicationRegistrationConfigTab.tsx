import type { ApplicationRegistrationData } from '~/pages/settings/applications/tabs/types/ApplicationRegistrationData';
import { useQuery } from '@apollo/client/react';
import { FindApplicationRegistrationVariablesDocument } from '~/generated-metadata/graphql';
import { Section } from 'ui/layout';
import { H2Title, Status } from 'ui/display';
import { useLingui } from '@lingui/react/macro';
import { getSettingsPath } from 'shared/utils';
import { SettingsPath } from 'shared/types';
import { ConfigVariableTable } from '@/settings/config-variables/components/ConfigVariableTable';

export const SettingsApplicationRegistrationConfigTab = ({
  registration,
}: {
  registration: ApplicationRegistrationData;
}) => {
  const { t } = useLingui();

  const applicationRegistrationId = registration.id;

  const { data: variablesData } = useQuery(
    FindApplicationRegistrationVariablesDocument,
    {
      variables: { applicationRegistrationId },
      skip: !applicationRegistrationId,
    },
  );

  const variables = variablesData?.findApplicationRegistrationVariables ?? [];

  const configVariables = variables.map((variable) => ({
    name: variable.key,
    description: variable.description,
    value: variable.value ?? <Status color="gray" text={t`Belum diisi`} />,
    to: getSettingsPath(
      SettingsPath.ApplicationRegistrationConfigVariableDetails,
      {
        applicationRegistrationId,
        variableKey: variable.key,
      },
    ),
  }));

  return (
    variables.length > 0 && (
      <Section>
        <H2Title
          title={t`Variabel Server`}
          description={t`Variabel server diterapkan ke semua instalasi ruang kerja.`}
        />
        <ConfigVariableTable configVariables={configVariables} />
      </Section>
    )
  );
};
