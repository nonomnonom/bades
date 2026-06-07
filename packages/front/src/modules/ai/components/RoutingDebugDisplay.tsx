import { styled } from '@linaria/react';
import { useContext, useState } from 'react';

import { IconChevronDown, IconChevronUp } from 'ui/display';
import { JsonTree } from 'ui/json-visualizer';
import { AnimatedExpandableContainer } from 'ui/layout';
import { ThemeContext, themeCssVariables } from 'ui/theme-constants';

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
        label={`Keputusan routing`}
        value={debug.routingTimeMs && `${debug.routingTimeMs}ms`}
      />
      <TimingRow
        label={`Pembuatan konteks (routing)`}
        value={debug.contextBuildTimeMs && `${debug.contextBuildTimeMs}ms`}
      />
      <TimingRow
        label={`Pembuatan konteks (agen)`}
        value={
          debug.agentContextBuildTimeMs && `${debug.agentContextBuildTimeMs}ms`
        }
      />
      <TimingRow
        label={`Pembuatan alat`}
        value={debug.toolGenerationTimeMs && `${debug.toolGenerationTimeMs}ms`}
      />
      <TimingRow
        label={`Persiapan permintaan AI`}
        value={debug.aiRequestPrepTimeMs && `${debug.aiRequestPrepTimeMs}ms`}
      />
      <TimingRow
        label={`Eksekusi agen`}
        value={debug.agentExecutionTimeMs && `${debug.agentExecutionTimeMs}ms`}
      />
      <TimingRow label={`Total waktu`} value={totalTime} />
      <TimingRow label={`Alat tersedia`} value={debug.toolCount} />
      <TimingRow label={`Panggilan alat`} value={debug.toolCallCount} />
      <TimingRow label={`Data konteks`} value={debug.contextRecordCount} />
      <TimingRow
        label={`Ukuran konteks`}
        value={
          debug.contextSizeBytes !== undefined
            ? formatBytes(debug.contextSizeBytes)
            : undefined
        }
      />
      <TimingRow
        label={`Token routing`}
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
        label={`Token agen`}
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
      <TimingRow label={`Total biaya`} value={totalCost} />
    </StyledTimingSection>
  );
};

type DetailsTabProps = {
  debug: DebugInfo;
  copyToClipboard: (value: string) => void;
};

const DetailsTab = ({ debug, copyToClipboard }: DetailsTabProps) => {
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
        emptyArrayLabel={`Array kosong`}
        emptyObjectLabel={`Objek kosong`}
        emptyStringLabel={`[string kosong]`}
        arrowButtonCollapsedLabel={`Perluas`}
        arrowButtonExpandedLabel={`Ciutkan`}
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
  if (!debug.context) {
    return (
      <StyledTimingLabel>
        {`Tidak ada konteks yang diberikan untuk permintaan ini`}
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
          emptyArrayLabel={`Array kosong`}
          emptyObjectLabel={`Objek kosong`}
          emptyStringLabel={`[string kosong]`}
          arrowButtonCollapsedLabel={`Perluas`}
          arrowButtonExpandedLabel={`Ciutkan`}
          onNodeValueClick={copyToClipboard}
        />
      </StyledJsonTreeContainer>
    );
  } catch {
    const contextValue = debug.context;
    return (
      <StyledTimingLabel>
        {`Gagal mengurai konteks: ${contextValue}`}
      </StyledTimingLabel>
    );
  }
};

type RoutingDebugDisplayProps = {
  debug: DebugInfo;
};

export const RoutingDebugDisplay = ({ debug }: RoutingDebugDisplayProps) => {
  const { theme } = useContext(ThemeContext);
  const { copyToClipboard } = useCopyToClipboard();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('timing');

  return (
    <StyledContainer>
      <StyledToggleButton onClick={() => setIsExpanded(!isExpanded)}>
        <StyledTimingLabel>{`Info Debug`}</StyledTimingLabel>
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
              {`Waktu`}
            </StyledTab>
            <StyledTab
              isActive={activeTab === 'details'}
              onClick={() => setActiveTab('details')}
            >
              {`Detail`}
            </StyledTab>
            {debug.context && (
              <StyledTab
                isActive={activeTab === 'context'}
                onClick={() => setActiveTab('context')}
              >
                {`Konteks`}
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
