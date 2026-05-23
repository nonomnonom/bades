import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';

import { useDeleteOneObjectMetadataItem } from '@/object-metadata/hooks/useDeleteOneObjectMetadataItem';
import { useUpdateOneObjectMetadataItem } from '@/object-metadata/hooks/useUpdateOneObjectMetadataItem';
import { isDDLLockedState } from '@/client-config/states/isDDLLockedState';
import { isObjectMetadataReadOnly } from '@/object-record/read-only/utils/isObjectMetadataReadOnly';
import { AdvancedSettingsWrapper } from '@/settings/components/AdvancedSettingsWrapper';
import { SettingsUpdateDataModelObjectAboutForm } from '@/settings/data-model/object-details/components/SettingsUpdateDataModelObjectAboutForm';
import { SettingsObjectSearchSection } from '@/settings/data-model/object-details/components/tabs/SettingsObjectSearchSection';
import { SettingsDataModelObjectSettingsFormCard } from '@/settings/data-model/objects/forms/components/SettingsDataModelObjectSettingsFormCard';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { styled } from '@linaria/react';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useLingui } from '~/utils/i18n/badesI18n';
import { SettingsPath } from 'shared/types';
import { H2Title, IconArchive, IconTrash } from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

type ObjectSettingsProps = {
  objectMetadataItem: EnrichedObjectMetadataItem;
  isDeleting: boolean;
  setIsDeleting: (isDeleting: boolean) => void;
};

const StyledContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[8]};
`;

const StyledFormSectionContainer = styled.div`
  > * {
    padding-left: 0 !important;
  }
`;

const StyledDangerButtonsContainer = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const DELETE_OBJECT_MODAL_ID = 'delete-object-confirmation-modal';

export const ObjectSettings = ({
  objectMetadataItem,
  isDeleting,
  setIsDeleting,
}: ObjectSettingsProps) => {
  const { t } = useLingui();
  const navigate = useNavigateSettings();
  const { updateOneObjectMetadataItem } = useUpdateOneObjectMetadataItem();
  const { deleteOneObjectMetadataItem } = useDeleteOneObjectMetadataItem();
  const { enqueueSuccessSnackBar } = useSnackBar();
  const { openModal, closeModal } = useModal();

  const isDDLLocked = useAtomStateValue(isDDLLockedState);

  const isReadOnly =
    isObjectMetadataReadOnly({ objectMetadataItem }) || isDDLLocked;

  const handleDisable = async () => {
    const result = await updateOneObjectMetadataItem({
      idToUpdate: objectMetadataItem.id,
      updatePayload: { isActive: false },
    });

    if (result.status === 'successful') {
      navigate(SettingsPath.Objects);
    }
  };

  const handleDelete = () => {
    openModal(DELETE_OBJECT_MODAL_ID);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    const result = await deleteOneObjectMetadataItem(objectMetadataItem.id);

    if (result.status === 'successful') {
      enqueueSuccessSnackBar({
        message: t`Objek berhasil dihapus`,
      });
      closeModal(DELETE_OBJECT_MODAL_ID);
      navigate(SettingsPath.Objects);
      return;
    }

    setIsDeleting(false);
    closeModal(DELETE_OBJECT_MODAL_ID);
  };

  const objectLabel = objectMetadataItem.labelPlural;

  return (
    <StyledContentContainer>
      <StyledFormSectionContainer>
        <Section>
          <H2Title
            title={t`Tentang`}
            description={t`Nama dalam bentuk tunggal (mis. 'Surat') dan jamak (mis. 'Surat-surat').`}
          />
          <SettingsUpdateDataModelObjectAboutForm
            objectMetadataItem={objectMetadataItem}
          />
        </Section>
      </StyledFormSectionContainer>
      <StyledFormSectionContainer>
        <Section>
          <H2Title
            title={t`Opsi`}
            description={t`Pilih kolom yang akan mengidentifikasi data Anda`}
          />
          <SettingsDataModelObjectSettingsFormCard
            objectMetadataItem={objectMetadataItem}
          />
        </Section>
      </StyledFormSectionContainer>
      <AdvancedSettingsWrapper>
        <StyledFormSectionContainer>
          <Section>
            <H2Title
              title={t`Pencarian`}
              description={t`Atur bagaimana objek ini muncul dalam hasil pencarian`}
            />
            <SettingsObjectSearchSection
              objectMetadataItem={objectMetadataItem}
              isReadOnly={isReadOnly}
            />
          </Section>
        </StyledFormSectionContainer>
      </AdvancedSettingsWrapper>
      {!isReadOnly && (
        <StyledFormSectionContainer>
          <Section>
            <H2Title
              title={t`Zona berbahaya`}
              description={t`Nonaktifkan objek`}
            />
            <StyledDangerButtonsContainer>
              <Button
                Icon={IconArchive}
                title={t`Nonaktifkan`}
                size="small"
                onClick={handleDisable}
              />
              {objectMetadataItem.isCustom && (
                <Button
                  Icon={IconTrash}
                  title={t`Hapus`}
                  size="small"
                  accent="danger"
                  variant="secondary"
                  onClick={handleDelete}
                />
              )}
            </StyledDangerButtonsContainer>
          </Section>
        </StyledFormSectionContainer>
      )}
      <ConfirmationModal
        modalInstanceId={DELETE_OBJECT_MODAL_ID}
        title={t`Hapus objek ${objectLabel}?`}
        subtitle={t`Ini akan menghapus objek beserta seluruh datanya secara permanen. Ketik "ya" untuk konfirmasi.`}
        confirmButtonText={t`Hapus`}
        onConfirmClick={confirmDelete}
        onClose={() => closeModal(DELETE_OBJECT_MODAL_ID)}
        confirmationValue="ya"
        confirmationPlaceholder="ya"
        loading={isDeleting}
      />
    </StyledContentContainer>
  );
};
