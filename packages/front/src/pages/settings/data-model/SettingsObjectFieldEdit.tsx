import { useLingui } from '~/utils/i18n/badesI18n';
import { zodResolver } from '@hookform/resolvers/zod';
import omit from 'lodash.omit';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { type z } from 'zod';

import { useFieldMetadataItem } from '@/object-metadata/hooks/useFieldMetadataItem';
import { useFilteredObjectMetadataItems } from '@/object-metadata/hooks/useFilteredObjectMetadataItems';
import { useGetRelationMetadata } from '@/object-metadata/hooks/useGetRelationMetadata';
import { useUpdateOneFieldMetadataItem } from '@/object-metadata/hooks/useUpdateOneFieldMetadataItem';
import { CoreObjectNamePlural } from '@/object-metadata/types/CoreObjectNamePlural';
import { formatFieldMetadataItemInput } from '@/object-metadata/utils/formatFieldMetadataItemInput';
import { isLabelIdentifierField } from '@/object-metadata/utils/isLabelIdentifierField';
import { isDDLLockedState } from '@/client-config/states/isDDLLockedState';
import { isObjectMetadataReadOnly } from '@/object-record/read-only/utils/isObjectMetadataReadOnly';
import { SaveAndCancelButtons } from '@/settings/components/SaveAndCancelButtons/SaveAndCancelButtons';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { FIELD_NAME_MAXIMUM_LENGTH } from '@/settings/data-model/constants/FieldNameMaximumLength';
import { SettingsDataModelFieldDescriptionForm } from '@/settings/data-model/fields/forms/components/SettingsDataModelFieldDescriptionForm';
import { SettingsDataModelFieldIconLabelForm } from '@/settings/data-model/fields/forms/components/SettingsDataModelFieldIconLabelForm';
import { SettingsDataModelFieldSettingsFormCard } from '@/settings/data-model/fields/forms/components/SettingsDataModelFieldSettingsFormCard';
import { settingsFieldFormSchema } from '@/settings/data-model/fields/forms/validation-schemas/settingsFieldFormSchema';
import { type SettingsFieldType } from '@/settings/data-model/types/SettingsFieldType';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { navigationMemorizedUrlState } from '@/ui/navigation/states/navigationMemorizedUrlState';
import { shouldNavigateBackToMemorizedUrlOnSaveState } from '@/ui/navigation/states/shouldNavigateBackToMemorizedUrlOnSaveState';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { styled } from '@linaria/react';
import { AppPath, SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined } from 'shared/utils';
import { H2Title, IconArchive, IconArchiveOff, IconTrash } from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';
import { FieldMetadataType } from '~/generated-metadata/graphql';
import { useNavigateApp } from '~/hooks/useNavigateApp';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';
import { getFieldMetadataItemInitialValues } from '~/pages/settings/data-model/utils/getFieldMetadataItemInitialValues';

//TODO: fix this type
export type SettingsDataModelFieldEditFormValues = z.infer<
  ReturnType<typeof settingsFieldFormSchema>
> &
  any;

const DELETE_FIELD_MODAL_ID = 'delete-field-confirmation-modal';
const StyledDangerButtons = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

export const SettingsObjectFieldEdit = () => {
  const navigateSettings = useNavigateSettings();
  const navigateApp = useNavigateApp();
  const { t } = useLingui();

  const { openModal, closeModal } = useModal();
  const { enqueueSuccessSnackBar } = useSnackBar();

  const navigate = useNavigate();

  const [navigationMemorizedUrl, setNavigationMemorizedUrl] = useAtomState(
    navigationMemorizedUrlState,
  );

  const [
    shouldNavigateBackToMemorizedUrlOnSave,
    setShouldNavigateBackToMemorizedUrlOnSave,
  ] = useAtomState(shouldNavigateBackToMemorizedUrlOnSaveState);

  const { objectNamePlural = '', fieldName = '' } = useParams();

  const { findObjectMetadataItemByNamePlural } =
    useFilteredObjectMetadataItems();

  const objectMetadataItem =
    findObjectMetadataItemByNamePlural(objectNamePlural);

  const isDDLLocked = useAtomStateValue(isDDLLockedState);

  const readonly =
    isObjectMetadataReadOnly({
      objectMetadataItem,
    }) || isDDLLocked;

  const {
    deactivateMetadataField,
    activateMetadataField,
    deleteMetadataField,
  } = useFieldMetadataItem();

  const [newNameDuringSave, setNewNameDuringSave] = useState<string | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const fieldMetadataItem = objectMetadataItem?.fields.find(
    (fieldMetadataItem) =>
      fieldMetadataItem.name === fieldName ||
      fieldMetadataItem.name === newNameDuringSave,
  );

  const getRelationMetadata = useGetRelationMetadata();
  const { updateOneFieldMetadataItem } = useUpdateOneFieldMetadataItem();

  const { settings, defaultValue } =
    getFieldMetadataItemInitialValues(fieldMetadataItem);

  const formConfig = useForm<SettingsDataModelFieldEditFormValues>({
    mode: 'onTouched',
    resolver: zodResolver(settingsFieldFormSchema()),
    defaultValues: {
      icon: fieldMetadataItem?.icon ?? 'Icon',
      type: fieldMetadataItem?.type as SettingsFieldType,
      label: fieldMetadataItem?.label ?? '',
      description: fieldMetadataItem?.description,
      isLabelSyncedWithName: fieldMetadataItem?.isLabelSyncedWithName ?? true,
      settings,
      defaultValue,
    },
  });

  useEffect(() => {
    if (!isDeleting && (!objectMetadataItem || !fieldMetadataItem)) {
      navigateApp(AppPath.NotFound);
    }
  }, [navigateApp, objectMetadataItem, fieldMetadataItem, isDeleting]);

  const { isDirty, isValid, isSubmitting } = formConfig.formState;

  const canSave = isDirty && isValid && !isSubmitting;

  if (!isDefined(objectMetadataItem) || !isDefined(fieldMetadataItem)) {
    return null;
  }

  const fieldLabel = fieldMetadataItem.label;
  const objectLabel = objectMetadataItem.labelPlural;

  const isLabelIdentifier = isLabelIdentifierField({
    fieldMetadataItem: fieldMetadataItem,
    objectMetadataItem: objectMetadataItem,
  });

  const fieldNamesThatCannotBeDeactivated = [
    'createdAt',
    'createdBy',
    'deletedAt',
    'updatedAt',
  ];

  const fieldCanBeDeactivated = !fieldNamesThatCannotBeDeactivated.includes(
    fieldMetadataItem.name,
  );

  const handleSave = async (
    formValues: SettingsDataModelFieldEditFormValues,
  ) => {
    if (readonly) {
      return;
    }

    const { dirtyFields } = formConfig.formState;
    setNewNameDuringSave(formValues.name);

    if (
      formValues.type === FieldMetadataType.RELATION &&
      'relation' in formValues &&
      'relation' in dirtyFields
    ) {
      const { relationFieldMetadataItem } =
        getRelationMetadata({
          fieldMetadataItem: fieldMetadataItem,
        }) ?? {};

      if (isDefined(relationFieldMetadataItem)) {
        const result = await updateOneFieldMetadataItem({
          objectMetadataId: objectMetadataItem.id,
          fieldMetadataIdToUpdate: relationFieldMetadataItem.id,
          updatePayload: formValues.relation.field,
        });

        if (result.status === 'failed') {
          return;
        }
      }
    }

    const otherDirtyFields = omit(dirtyFields, 'relation');

    if (Object.keys(otherDirtyFields).length > 0) {
      const formattedInput = Object.fromEntries(
        Object.entries(formatFieldMetadataItemInput(formValues)).filter(
          ([key]) => Object.keys(otherDirtyFields).includes(key),
        ),
      );

      const updateResult = await updateOneFieldMetadataItem({
        objectMetadataId: objectMetadataItem.id,
        fieldMetadataIdToUpdate: fieldMetadataItem.id,
        updatePayload: formattedInput,
      });

      if (updateResult.status === 'successful') {
        navigateBackOrToSettings();
      }
    }
  };

  const navigateBackOrToSettings = () => {
    if (
      shouldNavigateBackToMemorizedUrlOnSave &&
      isDefined(navigationMemorizedUrl)
    ) {
      navigate(navigationMemorizedUrl, { replace: true });

      setShouldNavigateBackToMemorizedUrlOnSave(false);
      setNavigationMemorizedUrl('/');

      return;
    }

    navigateSettings(SettingsPath.ObjectDetail, {
      objectNamePlural,
    });
  };

  const handleCancel = () => {
    navigateBackOrToSettings();
  };

  const handleDeactivate = async () => {
    if (readonly) {
      return;
    }

    const deactivationResult = await deactivateMetadataField(
      fieldMetadataItem.id,
      objectMetadataItem.id,
    );
    if (deactivationResult.status === 'successful') {
      navigateSettings(SettingsPath.ObjectDetail, {
        objectNamePlural,
      });
    }
  };

  const handleActivate = async () => {
    if (readonly) {
      return;
    }

    const activationResult = await activateMetadataField(
      fieldMetadataItem.id,
      objectMetadataItem.id,
    );

    if (activationResult.status === 'successful') {
      navigateSettings(SettingsPath.ObjectDetail, {
        objectNamePlural,
      });
    }
  };

  const handleDelete = () => {
    if (readonly || !fieldMetadataItem?.isCustom) {
      return;
    }

    openModal(DELETE_FIELD_MODAL_ID);
  };

  const confirmDelete = async () => {
    if (!isDefined(objectMetadataItem) || !isDefined(fieldMetadataItem)) {
      return;
    }

    setIsDeleting(true);

    const deleteResult = await deleteMetadataField({
      idToDelete: fieldMetadataItem.id,
    });

    if (deleteResult.status === 'successful') {
      enqueueSuccessSnackBar({
        message: t`Kolom dihapus`,
      });
      closeModal(DELETE_FIELD_MODAL_ID);
      navigateSettings(SettingsPath.ObjectDetail, {
        objectNamePlural,
      });
      return;
    }

    setIsDeleting(false);
    closeModal(DELETE_FIELD_MODAL_ID);
  };

  return (
    <>
      {/* oxlint-disable-next-line react/jsx-props-no-spreading */}
      <FormProvider {...formConfig}>
        <SubMenuTopBarContainer
          title={fieldMetadataItem?.label}
          links={[
            {
              children: t`Ruang Kerja`,
              href: getSettingsPath(SettingsPath.Workspace),
            },
            {
              children: t`Objek`,
              href: getSettingsPath(SettingsPath.Objects),
            },
            {
              children: objectMetadataItem.labelPlural,
              href: getSettingsPath(SettingsPath.ObjectDetail, {
                objectNamePlural,
              }),
            },
            {
              children: fieldMetadataItem.label,
            },
          ]}
          actionButton={
            <SaveAndCancelButtons
              isLoading={isSubmitting}
              isSaveDisabled={!canSave || readonly}
              isCancelDisabled={isSubmitting || readonly}
              onCancel={handleCancel}
              onSave={formConfig.handleSubmit(handleSave)}
            />
          }
        >
          <SettingsPageContainer>
            <Section>
              <H2Title
                title={t`Ikon dan Nama`}
                description={t`Nama dan ikon kolom ini`}
              />
              <SettingsDataModelFieldIconLabelForm
                fieldMetadataItem={fieldMetadataItem}
                maxLength={FIELD_NAME_MAXIMUM_LENGTH}
                isCreationMode={false}
                readonly={readonly}
              />
            </Section>
            {fieldMetadataItem.name !== CoreObjectNamePlural.NoteTarget &&
              fieldMetadataItem.name !== CoreObjectNamePlural.TaskTarget && (
                <>
                  <Section>
                    {fieldMetadataItem.isUnique ? (
                      <H2Title
                        title={t`Nilai`}
                        description={t`Nilai kolom ini harus unik`}
                      />
                    ) : (
                      <H2Title
                        title={t`Nilai`}
                        description={t`Nilai kolom ini`}
                      />
                    )}
                    <SettingsDataModelFieldSettingsFormCard
                      fieldType={fieldMetadataItem.type}
                      existingFieldMetadataId={fieldMetadataItem.id}
                      objectNameSingular={objectMetadataItem.nameSingular}
                      disabled={readonly}
                    />
                  </Section>
                </>
              )}
            <Section>
              <H2Title
                title={t`Deskripsi`}
                description={t`Deskripsi kolom ini`}
              />
              <SettingsDataModelFieldDescriptionForm
                fieldMetadataItem={fieldMetadataItem}
                disabled={readonly}
              />
            </Section>

            {!isLabelIdentifier && !readonly && fieldCanBeDeactivated && (
              <Section>
                <H2Title
                  title={t`Zona berbahaya`}
                  description={t`Nonaktifkan kolom ini`}
                />
                <StyledDangerButtons>
                  <Button
                    Icon={
                      fieldMetadataItem.isActive ? IconArchive : IconArchiveOff
                    }
                    variant="secondary"
                    title={
                      fieldMetadataItem.isActive ? t`Nonaktifkan` : t`Aktifkan`
                    }
                    size="small"
                    onClick={
                      fieldMetadataItem.isActive
                        ? handleDeactivate
                        : handleActivate
                    }
                  />
                  {fieldMetadataItem.isCustom && (
                    <Button
                      Icon={IconTrash}
                      variant="secondary"
                      accent="danger"
                      title={t`Hapus`}
                      size="small"
                      onClick={handleDelete}
                    />
                  )}
                </StyledDangerButtons>
              </Section>
            )}
          </SettingsPageContainer>
        </SubMenuTopBarContainer>
      </FormProvider>
      {fieldMetadataItem?.isCustom && (
        <ConfirmationModal
          modalInstanceId={DELETE_FIELD_MODAL_ID}
          title={t`Hapus kolom ${fieldLabel}?`}
          subtitle={t`Tindakan ini akan menghapus kolom dan semua datanya dari ${objectLabel} secara permanen. Ketik "ya" untuk mengonfirmasi.`}
          confirmButtonText={t`Hapus`}
          confirmationValue="ya"
          confirmationPlaceholder="ya"
          onConfirmClick={confirmDelete}
          onClose={() => closeModal(DELETE_FIELD_MODAL_ID)}
          loading={isDeleting}
        />
      )}
    </>
  );
};
