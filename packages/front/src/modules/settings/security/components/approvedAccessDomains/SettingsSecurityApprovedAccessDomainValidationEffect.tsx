import { approvedAccessDomainsState } from '@/settings/security/states/ApprovedAccessDomainsState';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { t } from '@lingui/core/macro';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { isDefined } from 'shared/utils';
import { useMutation } from '@apollo/client/react';
import { ValidateApprovedAccessDomainDocument } from '~/generated-metadata/graphql';

export const SettingsSecurityApprovedAccessDomainValidationEffect = () => {
  const [validateApprovedAccessDomainMutation] = useMutation(
    ValidateApprovedAccessDomainDocument,
  );
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const [searchParams] = useSearchParams();
  const approvedAccessDomainId = searchParams.get('wtdId');
  const validationToken = searchParams.get('validationToken');
  const setApprovedAccessDomains = useSetAtomState(approvedAccessDomainsState);

  useEffect(() => {
    if (isDefined(validationToken) && isDefined(approvedAccessDomainId)) {
      validateApprovedAccessDomainMutation({
        variables: {
          input: {
            validationToken,
            approvedAccessDomainId,
          },
        },
        onCompleted: () => {
          setApprovedAccessDomains((approvedAccessDomains) =>
            approvedAccessDomains.map((approvedAccessDomain) => ({
              ...approvedAccessDomain,
              isValidated:
                approvedAccessDomain.id === approvedAccessDomainId
                  ? true
                  : approvedAccessDomain.isValidated,
            })),
          );
          enqueueSuccessSnackBar({
            message: t`Domain akses berhasil divalidasi`,
            options: {
              dedupeKey: 'approved-access-domain-validation-dedupe-key',
            },
          });
        },
        onError: (error) => {
          enqueueErrorSnackBar({
            message: error?.message
              ? error.message
              : t`Gagal memvalidasi domain akses`,
            options: {
              dedupeKey: 'approved-access-domain-validation-error-dedupe-key',
            },
          });
        },
      });
    }
    // Validate approved access domain only needs to run once at mount
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};
