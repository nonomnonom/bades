import { styled } from '@linaria/react';
import { useLingui } from '~/utils/i18n/badesI18n';
import { useContext } from 'react';
import { AppTooltip, IconLock, TooltipDelay } from 'ui/display';
import { ThemeContext, themeCssVariables } from 'ui/theme-constants';
import { MessageChannelVisibility } from '~/generated/graphql';

const StyledContainer = styled.div<{ isCompact?: boolean }>`
  align-items: center;
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: 4px;
  color: ${themeCssVariables.font.color.tertiary};
  display: flex;
  flex: 1;
  flex: ${({ isCompact }) => (isCompact ? '0 0 auto' : '1 0 0')};
  font-size: ${themeCssVariables.font.size.sm};

  font-weight: ${themeCssVariables.font.weight.regular};
  gap: ${themeCssVariables.spacing[1]};
  height: 20px;

  margin-left: auto;
  min-width: ${themeCssVariables.spacing[21]};
  padding: ${themeCssVariables.spacing[0]} ${themeCssVariables.spacing[1]};
  width: ${({ isCompact }) => (isCompact ? 'auto' : '100%')};
`;

type EmailThreadNotSharedProps = {
  visibility: MessageChannelVisibility;
};

export const EmailThreadNotShared = ({
  visibility,
}: EmailThreadNotSharedProps) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useLingui();
  const containerId = 'email-thread-not-shared';
  const isCompact = visibility === MessageChannelVisibility.SUBJECT;

  return (
    <>
      <StyledContainer id={containerId} isCompact={isCompact}>
        <IconLock size={theme.icon.size.sm} />
        {t`Tidak dibagikan`}
      </StyledContainer>
      {visibility === MessageChannelVisibility.SUBJECT && (
        <AppTooltip
          anchorSelect={`#${containerId}`}
          content={t`Hanya subjek yang dibagikan`}
          delay={TooltipDelay.mediumDelay}
          noArrow
          place="bottom"
          positionStrategy="fixed"
        />
      )}
    </>
  );
};
