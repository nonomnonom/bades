import { type AppErrorDisplayProps } from '@/error-handler/types/AppErrorDisplayProps';
import { t } from '~/utils/i18n/badesI18n';
import { IconRefresh } from 'ui/display';
import { Button } from 'ui/input';
import {
  AnimatedPlaceholder,
  AnimatedPlaceholderEmptyContainer,
  AnimatedPlaceholderEmptySubTitle,
  AnimatedPlaceholderEmptyTextContainer,
  AnimatedPlaceholderEmptyTitle,
} from 'ui/layout';

export const AppErrorDisplay = ({
  resetErrorBoundary,
  title = t`Maaf, terjadi kesalahan`,
}: AppErrorDisplayProps) => {
  return (
    <AnimatedPlaceholderEmptyContainer>
      <AnimatedPlaceholder type="errorIndex" />
      <AnimatedPlaceholderEmptyTextContainer>
        <AnimatedPlaceholderEmptyTitle>{title}</AnimatedPlaceholderEmptyTitle>
        <AnimatedPlaceholderEmptySubTitle>
          {t`Silakan muat ulang halaman.`}
        </AnimatedPlaceholderEmptySubTitle>
      </AnimatedPlaceholderEmptyTextContainer>
      <Button
        Icon={IconRefresh}
        title={t`Muat Ulang`}
        variant="secondary"
        onClick={resetErrorBoundary}
      />
    </AnimatedPlaceholderEmptyContainer>
  );
};
