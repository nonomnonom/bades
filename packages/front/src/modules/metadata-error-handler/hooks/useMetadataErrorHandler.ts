import { type CombinedGraphQLErrors } from '@apollo/client/errors';
import { t } from '~/utils/i18n/badesI18n';

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
    [CrudOperationType.CREATE]: t`membuat`,
    [CrudOperationType.UPDATE]: t`memperbarui`,
    [CrudOperationType.DELETE]: t`menghapus`,
    [CrudOperationType.RESTORE]: t`memulihkan`,
    [CrudOperationType.DESTROY]: t`menghancurkan`,
  } as const satisfies Record<CrudOperationType, string>;

  const TRANSLATED_METADATA_NAME = {
    objectMetadata: t`objek`,
    fieldMetadata: t`kolom`,
    view: t`tampilan`,
    viewField: t`kolom tampilan`,
    viewFieldGroup: t`grup kolom tampilan`,
    viewGroup: t`grup tampilan`,
    viewFilter: t`filter tampilan`,
    index: t`indeks`,
    logicFunction: t`fungsi logika`,
    rolePermissionFlag: t`izin peran`,
    permissionFlag: t`izin`,
    objectPermission: t`izin objek`,
    fieldPermission: t`izin kolom`,
    role: t`peran`,
    roleTarget: t`target peran`,
    agent: t`agen`,
    skill: t`kemampuan`,
    pageLayout: t`tata letak halaman`,
    pageLayoutTab: t`tab tata letak`,
    pageLayoutWidget: t`widget tata letak`,
    rowLevelPermissionPredicate: t`predikat izin baris`,
    rowLevelPermissionPredicateGroup: t`grup predikat izin baris`,
    viewFilterGroup: t`grup filter tampilan`,
    commandMenuItem: t`item menu perintah`,
    frontComponent: t`komponen tampilan`,
    navigationMenuItem: t`item menu navigasi`,
    webhook: t`webhook`,
    viewSort: t`urutan tampilan`,
    applicationVariable: t`variabel aplikasi`,
    connectionProvider: t`penyedia koneksi`,
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
            message: t`Gagal ${translatedOperationType} ${translatedMetadataName}. Validasi ${relatedEntityNames} terkait gagal. Periksa konfigurasi Anda dan coba lagi.`,
          });
        }

        if (
          targetErrors.length === 0 &&
          relatedFailingMetadataNames.length === 0
        ) {
          enqueueErrorSnackBar({
            message: t`Gagal ${translatedOperationType} ${translatedMetadataName}. Silakan coba lagi.`,
          });
        }
        break;
      }

      case 'v2-internal': {
        const { code } = classification;
        const errorMessage =
          code ===
          WorkspaceMigrationV2ExceptionCode.BUILDER_INTERNAL_SERVER_ERROR
            ? t`Terjadi kesalahan internal saat memvalidasi perubahan Anda. Hubungi dukungan.`
            : t`Terjadi kesalahan internal saat menerapkan perubahan Anda. Hubungi dukungan dan coba lagi nanti.`;

        enqueueErrorSnackBar({ message: errorMessage });
        break;
      }
    }
  };

  return {
    handleMetadataError,
  };
};
