import { type CombinedGraphQLErrors } from '@apollo/client/errors';
import { classifyMetadataError } from '@/metadata-error-handler/utils/classifyMetadataError';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import {
  type AllMetadataName,
  WorkspaceMigrationV2ExceptionCode,
} from 'shared/metadata';
import { CrudOperationType } from 'shared/types';

export const useMetadataErrorHandler = () => {
  const { enqueueErrorSnackBar } = useSnackBar();

  const TRANSLATED_OPERATION_TYPE = {
    [CrudOperationType.CREATE]: `membuat`,
    [CrudOperationType.UPDATE]: `memperbarui`,
    [CrudOperationType.DELETE]: `menghapus`,
    [CrudOperationType.RESTORE]: `memulihkan`,
    [CrudOperationType.DESTROY]: `menghancurkan`,
  } as const satisfies Record<CrudOperationType, string>;

  const TRANSLATED_METADATA_NAME = {
    objectMetadata: `objek`,
    fieldMetadata: `kolom`,
    view: `tampilan`,
    viewField: `kolom tampilan`,
    viewFieldGroup: `grup kolom tampilan`,
    viewGroup: `grup tampilan`,
    viewFilter: `filter tampilan`,
    index: `indeks`,
    logicFunction: `fungsi logika`,
    rolePermissionFlag: `izin peran`,
    permissionFlag: `izin`,
    objectPermission: `izin objek`,
    fieldPermission: `izin kolom`,
    role: `peran`,
    roleTarget: `target peran`,
    agent: `agen`,
    skill: `kemampuan`,
    pageLayout: `tata letak halaman`,
    pageLayoutTab: `tab tata letak`,
    pageLayoutWidget: `widget tata letak`,
    rowLevelPermissionPredicate: `predikat izin baris`,
    rowLevelPermissionPredicateGroup: `grup predikat izin baris`,
    viewFilterGroup: `grup filter tampilan`,
    commandMenuItem: `item menu perintah`,
    frontComponent: `komponen tampilan`,
    navigationMenuItem: `item menu navigasi`,
    webhook: `webhook`,
    viewSort: `urutan tampilan`,
    applicationVariable: `variabel aplikasi`,
    connectionProvider: `penyedia koneksi`,
  } as const satisfies Record<AllMetadataName, string>;

  const handleMetadataError = (
    error: CombinedGraphQLErrors,
    options: {
      primaryMetadataName: AllMetadataName;
      operationType: CrudOperationType;
    },
  ) => {
    const classification = classifyMetadataError({
      error,
      primaryMetadataName: options.primaryMetadataName,
    });

    const translatedMetadataName =
      TRANSLATED_METADATA_NAME[options.primaryMetadataName];

    switch (classification.type) {
      case 'v1':
        enqueueErrorSnackBar({ apolloError: classification.error });
        break;

      case 'v2-validation': {
        const { extensions, primaryMetadataName, relatedFailingMetadataNames } =
          classification;

        const targetErrors = extensions.errors[primaryMetadataName] ?? [];
        if (targetErrors.length > 0) {
          targetErrors.forEach((entityError) => {
            entityError.errors.forEach((validationError) =>
              enqueueErrorSnackBar({
                message:
                  validationError.userFriendlyMessage ??
                  validationError.message,
              }),
            );
          });
        }

        const translatedOperationType =
          TRANSLATED_OPERATION_TYPE[options.operationType];

        if (
          targetErrors.length === 0 &&
          relatedFailingMetadataNames.length > 0
        ) {
          const relatedEntityNames = relatedFailingMetadataNames
            .map((metadataName) => TRANSLATED_METADATA_NAME[metadataName])
            .join(', ');

          enqueueErrorSnackBar({
            message: `Gagal ${translatedOperationType} ${translatedMetadataName}. Validasi ${relatedEntityNames} terkait gagal. Periksa konfigurasi Anda dan coba lagi.`,
          });
        }

        if (
          targetErrors.length === 0 &&
          relatedFailingMetadataNames.length === 0
        ) {
          enqueueErrorSnackBar({
            message: `Gagal ${translatedOperationType} ${translatedMetadataName}. Silakan coba lagi.`,
          });
        }
        break;
      }

      case 'v2-internal': {
        const { code } = classification;
        const errorMessage =
          code ===
          WorkspaceMigrationV2ExceptionCode.BUILDER_INTERNAL_SERVER_ERROR
            ? `Terjadi kesalahan internal saat memvalidasi perubahan Anda. Hubungi dukungan.`
            : `Terjadi kesalahan internal saat menerapkan perubahan Anda. Hubungi dukungan dan coba lagi nanti.`;

        enqueueErrorSnackBar({ message: errorMessage });
        break;
      }
    }
  };

  return {
    handleMetadataError,
  };
};
