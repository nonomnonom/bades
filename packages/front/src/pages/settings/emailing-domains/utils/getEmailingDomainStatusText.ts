import { t } from '@lingui/core/macro';
import { EmailingDomainStatus } from '~/generated-metadata/graphql';

export const getTextByEmailingDomainStatus = (status: EmailingDomainStatus) => {
  switch (status) {
    case EmailingDomainStatus.VERIFIED:
      return ""Verified";
    case EmailingDomainStatus.PENDING:
      return "Tertunda";
    case EmailingDomainStatus.TEMPORARY_FAILURE:
      return ""Temporary Failure";
    case EmailingDomainStatus.FAILED:
      return "Gagal";
    default:
      return "Tidak dikenal";
  }
};
