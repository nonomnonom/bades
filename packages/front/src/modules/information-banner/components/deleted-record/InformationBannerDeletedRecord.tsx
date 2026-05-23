import { InformationBanner } from '@/information-banner/components/InformationBanner';
import { useRestoreManyRecords } from '@/object-record/hooks/useRestoreManyRecords';
import { styled } from '@linaria/react';
import { t } from '~/utils/i18n/badesI18n';
import { IconRefresh } from 'ui/display';

const StyledInformationBannerDeletedRecord = styled.div`
  height: 40px;
  position: relative;

  &:empty {
    height: 0;
  }
`;

export const InformationBannerDeletedRecord = ({
  recordId,
  objectNameSingular,
}: {
  recordId: string;
  objectNameSingular: string;
}) => {
  const { restoreManyRecords } = useRestoreManyRecords({
    objectNameSingular,
  });

  return (
    <StyledInformationBannerDeletedRecord>
      <InformationBanner
        componentInstanceId="information-banner-deleted-record"
        color="danger"
        message={t`Data ini telah dihapus`}
        buttonTitle={t`Restore`}
        buttonIcon={IconRefresh}
        buttonOnClick={() => restoreManyRecords({ idsToRestore: [recordId] })}
      />
    </StyledInformationBannerDeletedRecord>
  );
};
