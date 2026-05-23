import { LogicFunctionExecutionResult } from '@/logic-functions/components/LogicFunctionExecutionResult';
import { LogicFunctionLogs } from '@/logic-functions/components/LogicFunctionLogs';
import { type LogicFunctionFormValues } from '@/logic-functions/hooks/useLogicFunctionUpdateFormState';
import { useExecuteLogicFunction } from '@/logic-functions/hooks/useExecuteLogicFunction';
import {
  buildDatabaseEventPayload,
  buildHttpPayload,
  buildToolPayloadFromSchema,
  type TriggerKind,
} from '@/settings/logic-functions/utils/getTriggerSamplePayload';
import { styled } from '@linaria/react';
import { useLingui } from '~/utils/i18n/badesI18n';
import { isDefined } from 'shared/utils';
import {
  H2Title,
  IconClock,
  IconDatabase,
  IconPlayerPlay,
  IconTool,
  IconWebhook,
  type IconComponent,
} from 'ui/display';
import { Button, CodeEditor, CoreEditorHeader } from 'ui/input';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';

type TriggerButton = {
  kind: TriggerKind;
  label: string;
  Icon: IconComponent;
};

const StyledInputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
`;

const StyledCodeEditorContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledTriggerButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledTriggerLabel = styled.span`
  color: ${themeCssVariables.font.color.light};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

export const SettingsLogicFunctionTestTab = ({
  handleExecute,
  logicFunctionId,
  formValues,
  isTesting = false,
}: {
  handleExecute: () => void;
  logicFunctionId: string;
  formValues: LogicFunctionFormValues;
  isTesting?: boolean;
}) => {
  const { t } = useLingui();

  const { updateLogicFunctionInput, logicFunctionTestData } =
    useExecuteLogicFunction({
      logicFunctionId,
    });

  const {
    httpRouteTriggerSettings,
    cronTriggerSettings,
    databaseEventTriggerSettings,
    toolTriggerSettings,
  } = formValues;

  const triggerButtons: TriggerButton[] = [];
  if (isDefined(httpRouteTriggerSettings)) {
    triggerButtons.push({ kind: 'http', label: 'HTTP', Icon: IconWebhook });
  }
  if (isDefined(cronTriggerSettings)) {
    triggerButtons.push({ kind: 'cron', label: t`Terjadwal`, Icon: IconClock });
  }
  if (isDefined(databaseEventTriggerSettings)) {
    triggerButtons.push({
      kind: 'databaseEvent',
      label: t`Perubahan data`,
      Icon: IconDatabase,
    });
  }
  if (isDefined(toolTriggerSettings)) {
    triggerButtons.push({ kind: 'tool', label: t`Alat AI`, Icon: IconTool });
  }

  const onChange = (value: string) => {
    try {
      updateLogicFunctionInput(JSON.parse(value));
    } catch {
      // ignore invalid JSON while user is still typing
    }
  };

  const fillSamplePayload = (kind: TriggerKind) => {
    const payload = (() => {
      switch (kind) {
        case 'http':
          return isDefined(httpRouteTriggerSettings)
            ? buildHttpPayload(httpRouteTriggerSettings)
            : {};
        case 'cron':
          return {};
        case 'databaseEvent':
          return isDefined(databaseEventTriggerSettings)
            ? buildDatabaseEventPayload(databaseEventTriggerSettings)
            : {};
        case 'tool':
          return buildToolPayloadFromSchema(toolTriggerSettings?.inputSchema);
      }
    })();
    updateLogicFunctionInput(payload);
  };

  return (
    <Section>
      <H2Title
        title={t`Uji coba fungsi`}
        description={t`Masukkan input JSON, lalu tekan "Jalankan Fungsi".`}
      />
      <StyledInputsContainer>
        {triggerButtons.length > 0 && (
          <div>
            <StyledTriggerLabel>{t`Isi dengan contoh masukan dari`}</StyledTriggerLabel>
            <StyledTriggerButtonRow>
              {triggerButtons.map((trigger) => (
                <Button
                  key={trigger.kind}
                  Icon={trigger.Icon}
                  title={trigger.label}
                  variant="secondary"
                  size="small"
                  onClick={() => fillSamplePayload(trigger.kind)}
                />
              ))}
            </StyledTriggerButtonRow>
          </div>
        )}
        <StyledCodeEditorContainer>
          <CoreEditorHeader
            title={t`Masukan`}
            rightNodes={[
              <Button
                title={t`Jalankan Fungsi`}
                variant="primary"
                accent="blue"
                size="small"
                Icon={IconPlayerPlay}
                onClick={handleExecute}
                disabled={isTesting}
              />,
            ]}
          />
          <CodeEditor
            value={JSON.stringify(logicFunctionTestData.input, null, 4)}
            language="json"
            height={100}
            onChange={onChange}
            variant="with-header"
            resizable
          />
        </StyledCodeEditorContainer>
        <LogicFunctionExecutionResult
          logicFunctionTestData={logicFunctionTestData}
          isTesting={isTesting}
        />
        {logicFunctionTestData.output.logs.length > 0 && (
          <StyledCodeEditorContainer>
            <LogicFunctionLogs
              componentInstanceId={`settings-logic-function-logs-${logicFunctionId}`}
              value={isTesting ? '' : logicFunctionTestData.output.logs}
            />
          </StyledCodeEditorContainer>
        )}
      </StyledInputsContainer>
    </Section>
  );
};
