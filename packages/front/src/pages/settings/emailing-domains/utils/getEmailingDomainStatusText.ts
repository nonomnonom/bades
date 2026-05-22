import { t } from '@lingui/core/macro';
import { EmailingDomainStatus } from '~/generated-metadata/graphql';

export const getTextByEmailingDomainStatus = (status: EmailingDomainStatus) => {
  switch (status) {
    case EmailingDomainStatus.VERIFIED:
      return t`Terverifikasi`;
    case EmailingDomainStatus.PENDING:
      return t`Menunggu`;
    case EmailingDomainStatus.TEMPORARY_FAILURE:
      return t`Kegagalan Sementara`;
    case EmailingDomainStatus.FAILED:
      return t`Gagal`;
    default:
      return t`Tidak diketahui`;
  }
};
