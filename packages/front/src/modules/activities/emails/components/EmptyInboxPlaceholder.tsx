import { useComposeEmailForTargetRecord } from '@/activities/emails/hooks/useComposeEmailForTargetRecord';
import { useLingui } from '~/utils/i18n/badesI18n';
import { IconMail } from 'ui/display';
import { Button } from 'ui/input';
import {
  AnimatedPlaceholder,
  AnimatedPlaceholderEmptyContainer,
  AnimatedPlaceholderEmptySubTitle,
  AnimatedPlaceholderEmptyTextContainer,
  AnimatedPlaceholderEmptyTitle,
  EMPTY_PLACEHOLDER_TRANSITION_PROPS,
} from 'ui/layout';

export const EmptyInboxPlaceholder = () => {
  const { t } = useLingui();
  const { openComposer, loading } = useComposeEmailForTargetRecord();

  return (
    <AnimatedPlaceholderEmptyContainer
      // oxlint-disable-next-line react/jsx-props-no-spreading
      {...EMPTY_PLACEHOLDER_TRANSITION_PROPS}
    >
      <AnimatedPlaceholder type="emptyInbox" />
      <AnimatedPlaceholderEmptyTextContainer>
        <AnimatedPlaceholderEmptyTitle>
          Kotak Masuk Kosong
        </AnimatedPlaceholderEmptyTitle>
        <AnimatedPlaceholderEmptySubTitle>
          Belum ada pertukaran email dengan data ini.
        </AnimatedPlaceholderEmptySubTitle>
      </AnimatedPlaceholderEmptyTextContainer>
      <Button
        Icon={IconMail}
        title={t`Kirim Email`}
        variant="secondary"
        onClick={openComposer}
        disabled={loading}
      />
    </AnimatedPlaceholderEmptyContainer>
  );
};
