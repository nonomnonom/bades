import { getLinkToShowPage } from '@/object-metadata/utils/getLinkToShowPage';
import { t } from '~/utils/i18n/badesI18n';
import { isNonEmptyString } from '@sniptt/guards';
import { AvatarOrIcon, Chip, ChipVariant, LinkChip } from 'ui/components';

type MentionRecordChipProps = {
  recordId: string;
  objectNameSingular: string;
  label: string;
  imageUrl: string;
  className?: string;
};

export const MentionRecordChip = ({
  recordId,
  objectNameSingular,
  label,
  imageUrl,
  className,
}: MentionRecordChipProps) => {
  if (!isNonEmptyString(objectNameSingular)) {
    return (
      <Chip
        label={t`Objek tidak dikenal`}
        variant={ChipVariant.Transparent}
        disabled
      />
    );
  }

  if (!isNonEmptyString(recordId)) {
    return (
      <Chip
        label={t`Data telah dihapus`}
        variant={ChipVariant.Transparent}
        disabled
      />
    );
  }

  const linkToShowPage = getLinkToShowPage(objectNameSingular, {
    id: recordId,
  });

  return (
    <LinkChip
      label={label}
      emptyLabel={t`Tanpa judul`}
      to={linkToShowPage}
      variant={ChipVariant.Highlighted}
      className={className}
      leftComponent={
        <AvatarOrIcon
          placeholder={label}
          placeholderColorSeed={recordId}
          avatarType="rounded"
          avatarUrl={imageUrl}
        />
      }
    />
  );
};
