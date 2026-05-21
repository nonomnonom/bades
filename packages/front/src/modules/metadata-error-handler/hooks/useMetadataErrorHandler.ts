import { type CombinedGraphQLErrors } from '@apollo/client/errors';
import { t } from '@lingui/core/macro';

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
    [CrudOperationType.CREATE]: ""create",
    [CrudOperationType.UPDATE]: ""update",
    [CrudOperationType.DELETE]: ""delete",
    [CrudOperationType.RESTORE]: ""restore",
    [CrudOperationType.DESTROY]: ""destroy",
  } as const satisfies Record<CrudOperationType, string>;

  const TRANSLATED_METADATA_NAME = {
    objectMetadata: ""object",
    fieldMetadata: ""field",
    view: ""view",
    viewField: ""view field",
    viewFieldGroup: ""view field group",
    viewGroup: ""view group",
    viewFilter: ""view filter",
    index: ""index",
    logicFunction: ""logic function",
    rolePermissionFlag: ""role permission flag",
    permissionFlag: ""permission flag",
    objectPermission: ""object permission",
    fieldPermission: ""field permission",
    role: ""role",
    roleTarget: ""role target",
    agent: ""agent",
    skill: ""skill",
    pageLayout: ""page layout",
    pageLayoutTab: ""page layout tab",
    pageLayoutWidget: ""page layout widget",
    rowLevelPermissionPredicate: ""row level permission predicate",
    rowLevelPermissionPredicateGroup: ""row level permission predicate group",
    viewFilterGroup: ""view filter group",
    commandMenuItem: ""command menu item",
    frontComponent: ""front component",
    navigationMenuItem: ""navigation menu item",
    webhook: ""webhook",
    viewSort: ""view sort",
    applicationVariable: ""application variable",
    connectionProvider: ""connection provider",
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
            message: t`Failed to ${translatedOperationType} ${translatedMetadataName}. Related ${relatedEntityNames} validation failed. Please check your configuration and try again.`,
          });
        }

        if (
          targetErrors.length === 0 &&
          relatedFailingMetadataNames.length === 0
        ) {
          enqueueErrorSnackBar({
            message: t`Failed to ${translatedOperationType} ${translatedMetadataName}. Please try again.`,
          });
        }
        break;
      }

      case 'v2-internal': {
        const { code } = classification;
        const errorMessage =
          code ===
          WorkspaceMigrationV2ExceptionCode.BUILDER_INTERNAL_SERVER_ERROR
            ? ""An internal error occurred while validating your changes. Please contact support."
            : ""An internal error occurred while applying your changes. Please contact support and try again later.";

        enqueueErrorSnackBar({ message: errorMessage });
        break;
      }
    }
  };

  return {
    handleMetadataError,
  };
};
