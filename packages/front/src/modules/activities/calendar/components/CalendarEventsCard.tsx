import { useLingui } from '~/utils/i18n/badesI18n';

import {
  AnimatedPlaceholder,
  AnimatedPlaceholderEmptyContainer,
  AnimatedPlaceholderEmptySubTitle,
  AnimatedPlaceholderEmptyTextContainer,
  AnimatedPlaceholderEmptyTitle,
  EMPTY_PLACEHOLDER_TRANSITION_PROPS,
} from 'ui/layout';

export const CalendarEventsCard = () => {
  const { t } = useLingui();

  return (
    <AnimatedPlaceholderEmptyContainer
      // oxlint-disable-next-line react/jsx-props-no-spreading
      {...EMPTY_PLACEHOLDER_TRANSITION_PROPS}
    >
      <AnimatedPlaceholder type="noMatchRecord" />
      <AnimatedPlaceholderEmptyTextContainer>
        <AnimatedPlaceholderEmptyTitle>
          {t`Belum ada jadwal`}
        </AnimatedPlaceholderEmptyTitle>
        <AnimatedPlaceholderEmptySubTitle>
          {t`Belum ada jadwal yang tercatat untuk data ini.`}
        </AnimatedPlaceholderEmptySubTitle>
      </AnimatedPlaceholderEmptyTextContainer>
    </AnimatedPlaceholderEmptyContainer>
  );
};
