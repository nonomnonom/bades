import { styled } from '@linaria/react';
import { useContext, useState } from 'react';

import { IconChevronDown, IconChevronUp } from 'ui/display';
import { JsonTree } from 'ui/json-visualizer';
import { AnimatedExpandableContainer } from 'ui/layout';
import { ThemeContext, themeCssVariables } from 'ui/theme-constants';

import { useLingui } from '@lingui/react/macro';
import { type DataMessagePart } from 'shared/ai';
import { type JsonValue } from 'type-fest';
import { useUsageValueFormatter } from '@/settings/usage/hooks/useUsageValueFormatter';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  margin-top: ${themeCssVariables.spacing[2]};
`;

const StyledToggleButton = styled.div`
  align-items: center;
  background: none;
  border: none;
  color: ${themeCssVariables.font.color.tertiary};
  cursor: pointer;
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  gap: ${themeCssVariables.spacing[1]};
  padding: ${themeCssVariables.spacing[1]} 0;
  transition: color calc(${themeCssVariables.animation.duration.normal} * 1s);

  &:hover {
    color: ${themeCssVariables.font.color.secondary};
  }
`;

const StyledContentContainer = styled.div`
  background: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.light};
  border-radius: ${themeCssVariables.border.radius.sm};
  min-width: 0;
  padding: ${themeCssVariables.spacing[3]};
`;

const StyledJsonTreeContainer = styled.div`
  overflow-x: auto;

  ul {
    min-width: 0;
  }
`;

const StyledTabContainer = styled.div`
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  gap: ${themeCssVariables.spacing[3]};
  margin-bottom: ${themeCssVariables.spacing[3]};
`;

const StyledTab = styled.div<{ isActive: boolean }>`
  color: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.color.primary
      : themeCssVariables.font.color.tertiary};
  cursor: pointer;
  font-size: ${themeCssVariables.font.size.sm};
  font-weight: ${({ isActive }) =>
    isActive
      ? themeCssVariables.font.weight.medium
      : themeCssVariables.font.weight.regular};
  padding-bottom: ${themeCssVariables.spacing[2]};
  transition: color calc(${themeCssVariables.animation.duration.normal} * 1s);

  &:hover {
    color: ${themeCssVariables.font.color.secondary};
  }
`;

const StyledTimingSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledTimingRow = styled.div`
  align-items: center;
  display: flex;
  font-size: ${themeCssVariables.font.size.sm};
  justify-content: space-between;
  padding: ${themeCssVariables.spacing[1]} 0;
`;

const StyledTimingLabel = styled.span`
  color: ${themeCssVariables.font.color.secondary};
`;

const StyledTimingValue = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-weight: ${themeCssVariables.font.weight.medium};
`;

type TabType = 'timing' | 'details' | 'context';

type TimingRowProps = {
  label: string;
  value: string | number | undefined;
};

const TimingRow = ({ label, value }: TimingRowProps) => {
  if (value === undefined) {
    return null;
  }

  return (
    <StyledTimingRow>
      <StyledTimingLabel>{label}</StyledTimingLabel>
      <StyledTimingValue>{value}</StyledTimingValue>
    </StyledTimingRow>
  );
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
};

const formatNumber = (num: number) => num.toLocaleString();

const formatTokenBreakdown = (
  total: number,
  prompt?: number,
  completion?: number,
) => {
  const formattedTotal = formatNumber(total);
  const hasValidBreakdown =
    prompt !== undefined &&
    completion !== undefined &&
    prompt > 0 &&
    completion > 0;

  if (hasValidBreakdown) {
    return `${formattedTotal} (${formatNumber(prompt)} → ${formatNumber(completion)})`;
  }

  return formattedTotal;
};

type DebugInfo = NonNullable<DataMessagePart['routing-status']['debug']>;

type TimingTabProps = {
  debug: DebugInfo;
};

const TimingTab = ({ debug }: TimingTabProps) => {
  const { t } = useLingui();
  const { formatUsageValue } = useUsageValueFormatter();
  const totalTime =
    debug.agentExecutionStartTimeMs !== undefined
      ? `${debug.agentExecutionStartTimeMs + (debug.agentExecutionTimeMs || 0)}ms`
      : undefined;

  const totalCost =
    debug.totalCostInCredits !== undefined
      ? formatUsageValue(debug.totalCostInCredits)
      : undefined;

  return (
    <StyledTimingSection>
      <TimingRow
        label={""Routing decision"}
        value={debug.routingTimeMs && `${debug.routingTimeMs}ms`}
      />
      <TimingRow
        label={""Context building (routing)"}
        value={debug.contextBuildTimeMs && `${debug.contextBuildTimeMs}ms`}
      />
      <TimingRow
        label={""Context building (agent)"}
        value={
          debug.agentContextBuildTimeMs && `${debug.agentContextBuildTimeMs}ms`
        }
      />
      <TimingRow
        label={""Tool generation"}
        value={debug.toolGenerationTimeMs && `${debug.toolGenerationTimeMs}ms`}
      />
      <TimingRow
        label={""AI request prep"}
        value={debug.aiRequestPrepTimeMs && `${debug.aiRequestPrepTimeMs}ms`}
      />
      <TimingRow
        label={""Agent execution"}
        value={debug.agentExecutionTimeMs && `${debug.agentExecutionTimeMs}ms`}
      />
      <TimingRow label={""Total time"} value={totalTime} />
      <TimingRow label={""Available tools"} value={debug.toolCount} />
      <TimingRow label={""Tool calls made"} value={debug.toolCallCount} />
      <TimingRow label={""Context records"} value={debug.contextRecordCount} />
      <TimingRow
        label={""Context size"}
        value={
          debug.contextSizeBytes !== undefined
            ? formatBytes(debug.contextSizeBytes)
            : undefined
        }
      />
      <TimingRow
        label={""Routing tokens"}
        value={
          debug.routingTotalTokens !== undefined
            ? formatTokenBreakdown(
                debug.routingTotalTokens,
                debug.routingPromptTokens,
                debug.routingCompletionTokens,
              )
            : undefined
        }
      />
      <TimingRow
        label={""Agent tokens"}
        value={
          debug.agentTotalTokens !== undefined
            ? formatTokenBreakdown(
                debug.agentTotalTokens,
                debug.agentPromptTokens,
                debug.agentCompletionTokens,
              )
            : undefined
        }
      />
      <TimingRow label={""Total cost"} value={totalCost} />
    </StyledTimingSection>
  );
};

type DetailsTabProps = {
  debug: DebugInfo;
  copyToClipboard: (value: string) => void;
};

const DetailsTab = ({ debug, copyToClipboard }: DetailsTabProps) => {
  const { t } = useLingui();

  const detailsData = {
    selectedAgent: {
      id: debug.selectedAgentId,
      label: debug.selectedAgentLabel,
    },
    fastModel: debug.fastModel,
    smartModel: debug.smartModel,
    agentModel: debug.agentModel,
    availableAgents: debug.availableAgents,
  };

  return (
    <StyledJsonTreeContainer>
      <JsonTree
        value={detailsData as JsonValue}
        shouldExpandNodeInitially={() => true}
        emptyArrayLabel={""Empty Array"}
        emptyObjectLabel={""Empty Object"}
        emptyStringLabel={"[string kosong]"}
        arrowButtonCollapsedLabel={"Perluas"}
        arrowButtonExpandedLabel={"Ciutkan"}
        onNodeValueClick={copyToClipboard}
      />
    </StyledJsonTreeContainer>
  );
};

type ContextTabProps = {
  debug: DebugInfo;
  copyToClipboard: (value: string) => void;
};

const ContextTab = ({ debug, copyToClipboard }: ContextTabProps) => {
  const { t } = useLingui();

  if (!debug.context) {
    return (
      <StyledTimingLabel>
        {""No context was provided for this request"}
      </StyledTimingLabel>
    );
  }

  try {
    const contextData = JSON.parse(debug.context);

    return (
      <StyledJsonTreeContainer>
        <JsonTree
          value={contextData as JsonValue}
          shouldExpandNodeInitially={() => false}
          emptyArrayLabel={""Empty Array"}
          emptyObjectLabel={""Empty Object"}
          emptyStringLabel={"[string kosong]"}
          arrowButtonCollapsedLabel={"Perluas"}
          arrowButtonExpandedLabel={"Ciutkan"}
          onNodeValueClick={copyToClipboard}
        />
      </StyledJsonTreeContainer>
    );
  } catch {
    const contextValue = debug.context;
    return (
      <StyledTimingLabel>
        {t`Failed to parse context: ${contextValue}`}
      </StyledTimingLabel>
    );
  }
};

type RoutingDebugDisplayProps = {
  debug: DebugInfo;
};

export const RoutingDebugDisplay = ({ debug }: RoutingDebugDisplayProps) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useLingui();
  const { copyToClipboard } = useCopyToClipboard();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('timing');

  return (
    <StyledContainer>
      <StyledToggleButton onClick={() => setIsExpanded(!isExpanded)}>
        <StyledTimingLabel>{""Debug Info"}</StyledTimingLabel>
        {isExpanded ? (
          <IconChevronUp size={theme.icon.size.sm} />
        ) : (
          <IconChevronDown size={theme.icon.size.sm} />
        )}
      </StyledToggleButton>

      <AnimatedExpandableContainer isExpanded={isExpanded} mode="fit-content">
        <StyledContentContainer>
          <StyledTabContainer>
            <StyledTab
              isActive={activeTab === 'timing'}
              onClick={() => setActiveTab('timing')}
            >
              {""Timing"}
            </StyledTab>
            <StyledTab
              isActive={activeTab === 'details'}
              onClick={() => setActiveTab('details')}
            >
              {"Detail"}
            </StyledTab>
            {debug.context && (
              <StyledTab
                isActive={activeTab === 'context'}
                onClick={() => setActiveTab('context')}
              >
                {""Context"}
              </StyledTab>
            )}
          </StyledTabContainer>

          {activeTab === 'timing' && <TimingTab debug={debug} />}
          {activeTab === 'details' && (
            <DetailsTab debug={debug} copyToClipboard={copyToClipboard} />
          )}
          {activeTab === 'context' && (
            <ContextTab debug={debug} copyToClipboard={copyToClipboard} />
          )}
        </StyledContentContainer>
      </AnimatedExpandableContainer>
    </StyledContainer>
  );
};
