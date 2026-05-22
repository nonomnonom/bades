import { type LogicFunctionFormValues } from '@/logic-functions/hooks/useLogicFunctionUpdateFormState';
import { SettingsLogicFunctionCronTriggerSection } from '@/settings/logic-functions/components/triggers/SettingsLogicFunctionCronTriggerSection';
import { SettingsLogicFunctionDatabaseEventTriggerSection } from '@/settings/logic-functions/components/triggers/SettingsLogicFunctionDatabaseEventTriggerSection';
import { SettingsLogicFunctionHttpTriggerSection } from '@/settings/logic-functions/components/triggers/SettingsLogicFunctionHttpTriggerSection';
import { SettingsLogicFunctionToolTriggerSection } from '@/settings/logic-functions/components/triggers/SettingsLogicFunctionToolTriggerSection';
import { SettingsLogicFunctionWorkflowActionTriggerSection } from '@/settings/logic-functions/components/triggers/SettingsLogicFunctionWorkflowActionTriggerSection';
import { styled } from '@linaria/react';
import { useLingui } from '~/utils/i18n/badesI18n';
import { isDefined } from 'shared/utils';
import { Callout, IconInfoCircle } from 'ui/display';
import { themeCssVariables } from 'ui/theme-constants';

const StyledEmptyState = styled.div`
  background-color: ${themeCssVariables.background.secondary};
  border: 1px dashed ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  color: ${themeCssVariables.font.color.secondary};
  font-size: ${themeCssVariables.font.size.md};
  padding: ${themeCssVariables.spacing[4]};
  text-align: center;
`;

const StyledCalloutWrapper = styled.div`
  margin-bottom: ${themeCssVariables.spacing[6]};
`;

export const SettingsLogicFunctionTriggersTab = ({
  formValues,
  onChange,
  readonly = false,
  applicationName,
}: {
  formValues: LogicFunctionFormValues;
  onChange: <TKey extends keyof LogicFunctionFormValues>(
    key: TKey,
  ) => (value: LogicFunctionFormValues[TKey]) => void;
  readonly?: boolean;
  applicationName?: string;
}) => {
  const { t } = useLingui();

  const hasAnyTrigger =
    isDefined(formValues.httpRouteTriggerSettings) ||
    isDefined(formValues.cronTriggerSettings) ||
    isDefined(formValues.databaseEventTriggerSettings) ||
    isDefined(formValues.toolTriggerSettings) ||
    isDefined(formValues.workflowActionTriggerSettings);

  if (readonly && !hasAnyTrigger) {
    return isDefined(applicationName) ? (
      <StyledCalloutWrapper>
        <Callout
          variant="info"
          Icon={IconInfoCircle}
          title={t`Disertakan bersama ${applicationName}`}
          description={t`Fungsi ini tidak memiliki pemicu yang dikonfigurasi, sehingga hanya dapat dipanggil dari tab Uji Coba atau oleh fungsi lain.`}
        />
      </StyledCalloutWrapper>
    ) : (
      <StyledEmptyState>
        {t`Tidak ada pemicu yang dikonfigurasi untuk fungsi ini.`}
      </StyledEmptyState>
    );
  }

  return (
    <>
      <SettingsLogicFunctionHttpTriggerSection
        value={formValues.httpRouteTriggerSettings}
        onChange={onChange('httpRouteTriggerSettings')}
        readonly={readonly}
      />
      <SettingsLogicFunctionCronTriggerSection
        value={formValues.cronTriggerSettings}
        onChange={onChange('cronTriggerSettings')}
        readonly={readonly}
      />
      <SettingsLogicFunctionDatabaseEventTriggerSection
        value={formValues.databaseEventTriggerSettings}
        onChange={onChange('databaseEventTriggerSettings')}
        readonly={readonly}
      />
      <SettingsLogicFunctionToolTriggerSection
        value={formValues.toolTriggerSettings}
        onChange={onChange('toolTriggerSettings')}
        readonly={readonly}
      />
      <SettingsLogicFunctionWorkflowActionTriggerSection
        value={formValues.workflowActionTriggerSettings}
        onChange={onChange('workflowActionTriggerSettings')}
        readonly={readonly}
      />
      {!readonly && !hasAnyTrigger && (
        <StyledEmptyState>
          {t`Tidak ada pemicu yang aktif. Aktifkan salah satu opsi di atas untuk memilih cara fungsi ini dipanggil.`}
        </StyledEmptyState>
      )}
    </>
  );
};
