import { useComposeEmailForTargetRecord } from '@/activities/emails/hooks/useComposeEmailForTargetRecord';
import { Trans, useLingui } from '@lingui/react/macro';
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
          <Trans>Kotak Masuk Kosong</Trans>
        </AnimatedPlaceholderEmptyTitle>
        <AnimatedPlaceholderEmptySubTitle>
          <Trans>Belum ada pertukaran email dengan data ini.</Trans>
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
