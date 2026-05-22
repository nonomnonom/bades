import { SettingsDnsRecordsTable } from '@/settings/components/SettingsDnsRecordsTable';

import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { t } from '@lingui/core/macro';
import { H2Title, IconRefresh } from 'ui/display';
import { Button } from 'ui/input';

import { Section } from 'ui/layout';
import { useMutation } from '@apollo/client/react';
import {
  type EmailingDomain,
  VerifyEmailingDomainDocument,
} from '~/generated-metadata/graphql';

type SettingsEmailingDomainVerificationRecordsProps = {
  domain: EmailingDomain;
};

export const SettingsEmailingDomainVerificationRecords = ({
  domain,
}: SettingsEmailingDomainVerificationRecordsProps) => {
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const [verifyEmailingDomainMutation, { loading: isVerifying }] = useMutation(
    VerifyEmailingDomainDocument,
  );

  if (!domain.verificationRecords || domain.verificationRecords.length === 0) {
    return null;
  }

  const handleVerifyEmailingDomain = async () => {
    try {
      await verifyEmailingDomainMutation({
        variables: {
          id: domain.id,
        },
      });
      enqueueSuccessSnackBar({
        message: t`Proses verifikasi dimulai`,
      });
    } catch (error) {
      enqueueErrorSnackBar({
        ...(CombinedGraphQLErrors.is(error) ? { apolloError: error } : {}),
      });
    }
  };

  return (
    <Section>
      <H2Title
        title={t`Rekaman DNS`}
        description={t`Tambahkan rekaman berikut untuk memverifikasi domain Anda.`}
        adornment={
          <Button
            onClick={handleVerifyEmailingDomain}
            isLoading={isVerifying}
            variant="secondary"
            Icon={IconRefresh}
            size="small"
            title={t`Periksa verifikasi`}
            disabled={isVerifying}
          />
        }
      />
      <SettingsDnsRecordsTable records={domain.verificationRecords} />
    </Section>
  );
};
