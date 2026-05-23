import { t } from '~/utils/i18n/badesI18n';
import { type NonReadableViewFieldInfo } from '@/object-record/record-index/hooks/useHasCurrentViewNonReadableFields';
import { getNonReadableViewFieldSubTitle } from '@/object-record/record-index/utils/getNonReadableViewFieldSubTitle';
import { styled } from '@linaria/react';
import { isDefined } from 'shared/utils';
import {
  AnimatedPlaceholder,
  AnimatedPlaceholderEmptyContainer,
  AnimatedPlaceholderEmptySubTitle,
  AnimatedPlaceholderEmptyTextContainer,
  AnimatedPlaceholderEmptyTitle,
} from 'ui/layout';

const StyledEmptyPlaceholderOuterContainer = styled.div`
  height: 100%;
  width: 100%;
`;

type RecordIndexEmptyStateNotSharedProps = {
  nonReadableViewFieldInfo?: NonReadableViewFieldInfo;
};

export const RecordIndexEmptyStateNotShared = ({
  nonReadableViewFieldInfo,
}: RecordIndexEmptyStateNotSharedProps) => {
  return (
    <StyledEmptyPlaceholderOuterContainer>
      <AnimatedPlaceholderEmptyContainer>
        <AnimatedPlaceholder type="notShared" />
        <AnimatedPlaceholderEmptyTextContainer>
          <AnimatedPlaceholderEmptyTitle>
            {isDefined(nonReadableViewFieldInfo)
              ? t`Tampilan tidak dibagikan`
              : t`Objek tidak dibagikan`}
          </AnimatedPlaceholderEmptyTitle>
          <AnimatedPlaceholderEmptySubTitle>
            {isDefined(nonReadableViewFieldInfo)
              ? getNonReadableViewFieldSubTitle(nonReadableViewFieldInfo)
              : t`Anda tidak memiliki akses ke objek ini.`}
          </AnimatedPlaceholderEmptySubTitle>
        </AnimatedPlaceholderEmptyTextContainer>
      </AnimatedPlaceholderEmptyContainer>
    </StyledEmptyPlaceholderOuterContainer>
  );
};
