import { EmailingDomainStatus } from '~/generated-metadata/graphql';

export const getTextByEmailingDomainStatus = (status: EmailingDomainStatus) => {
  switch (status) {
    case EmailingDomainStatus.VERIFIED:
      return `Terverifikasi`;
    case EmailingDomainStatus.PENDING:
      return `Menunggu`;
    case EmailingDomainStatus.TEMPORARY_FAILURE:
      return `Kegagalan Sementara`;
    case EmailingDomainStatus.FAILED:
      return `Gagal`;
    default:
      return `Tidak diketahui`;
  }
};
