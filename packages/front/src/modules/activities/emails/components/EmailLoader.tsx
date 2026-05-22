import { t } from '~/utils/i18n/badesI18n';
import {
  AnimatedPlaceholder,
  AnimatedPlaceholderEmptyContainer,
  AnimatedPlaceholderEmptyTextContainer,
  AnimatedPlaceholderEmptyTitle,
} from 'ui/layout';
import { Loader } from 'ui/feedback';

export const EmailLoader = ({ loadingText }: { loadingText?: string }) => (
  <AnimatedPlaceholderEmptyContainer>
    <AnimatedPlaceholder type="loadingMessages" />
    <AnimatedPlaceholderEmptyTextContainer>
      <AnimatedPlaceholderEmptyTitle>
        {loadingText || t`Memuat email`}
      </AnimatedPlaceholderEmptyTitle>
      <Loader />
    </AnimatedPlaceholderEmptyTextContainer>
  </AnimatedPlaceholderEmptyContainer>
);
