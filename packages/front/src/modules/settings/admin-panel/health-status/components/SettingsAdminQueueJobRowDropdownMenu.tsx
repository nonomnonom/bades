import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { t } from '~/utils/i18n/badesI18n';
import { IconDotsVertical, IconRefresh, IconTrash } from 'ui/display';
import { LightIconButton } from 'ui/input';
import { MenuItem } from 'ui/navigation';
import { JobState } from '~/generated-admin/graphql';

type SettingsAdminQueueJobRowDropdownMenuProps = {
  jobId: string;
  jobState: JobState;
  onRetry?: () => void;
  onDelete: () => void;
};

export const SettingsAdminQueueJobRowDropdownMenu = ({
  jobId,
  jobState,
  onRetry,
  onDelete,
}: SettingsAdminQueueJobRowDropdownMenuProps) => {
  const dropdownId = `queue-job-row-${jobId}`;
  const { closeDropdown } = useCloseDropdown();

  const handleRetry = () => {
    onRetry?.();
    closeDropdown(dropdownId);
  };

  const handleDelete = () => {
    onDelete();
    closeDropdown(dropdownId);
  };

  return (
    <Dropdown
      dropdownId={dropdownId}
      dropdownPlacement="right-start"
      clickableComponent={
        <LightIconButton
          aria-label={t`Tindakan Pekerjaan`}
          Icon={IconDotsVertical}
          accent="tertiary"
        />
      }
      dropdownComponents={
        <DropdownContent>
          <DropdownMenuItemsContainer>
            {jobState === JobState.FAILED && onRetry && (
              <MenuItem
                text={t`Coba Ulang`}
                LeftIcon={IconRefresh}
                onClick={handleRetry}
              />
            )}
            <MenuItem
              accent="danger"
              text={t`Hapus`}
              LeftIcon={IconTrash}
              onClick={handleDelete}
            />
          </DropdownMenuItemsContainer>
        </DropdownContent>
      }
    />
  );
};
