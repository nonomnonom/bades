import { SettingsDatabaseEventsForm } from '@/settings/components/SettingsDatabaseEventsForm';
import { SettingsLogicFunctionTriggerPayloadFormat } from '@/settings/logic-functions/components/triggers/SettingsLogicFunctionTriggerPayloadFormat';
import { SettingsLogicFunctionTriggerSection } from '@/settings/logic-functions/components/triggers/SettingsLogicFunctionTriggerSection';
import { buildDatabaseEventPayload } from '@/settings/logic-functions/utils/getTriggerSamplePayload';
import { useLingui } from '~/utils/i18n/badesI18n';
import { type DatabaseEventTriggerSettings } from 'shared/application';
import { isDefined } from 'shared/utils';

const DEFAULT_DATABASE_EVENT_SETTINGS: DatabaseEventTriggerSettings = {
  eventName: '*.created',
};

type SettingsLogicFunctionDatabaseEventTriggerSectionProps = {
  value: DatabaseEventTriggerSettings | null;
  onChange: (value: DatabaseEventTriggerSettings | null) => void;
  readonly: boolean;
};

export const SettingsLogicFunctionDatabaseEventTriggerSection = ({
  value,
  onChange,
  readonly,
}: SettingsLogicFunctionDatabaseEventTriggerSectionProps) => {
  const { t } = useLingui();

  const [object = '', action = 'created'] = value?.eventName.split('.') ?? [];

  const updateEventNamePart = ({
    field,
    fieldValue,
  }: {
    field: 'object' | 'action';
    fieldValue: string | null;
  }) => {
    if (!isDefined(value)) return;
    const nextObject = field === 'object' ? (fieldValue ?? '') : object;
    const nextAction = field === 'action' ? (fieldValue ?? action) : action;
    onChange({ ...value, eventName: `${nextObject}.${nextAction}` });
  };

  return (
    <SettingsLogicFunctionTriggerSection
      title={t`Perubahan data`}
      description={t`Menjalankan fungsi saat ada rekaman yang berubah`}
      enabled={isDefined(value)}
      onEnabledChange={(checked) =>
        onChange(checked ? DEFAULT_DATABASE_EVENT_SETTINGS : null)
      }
      readonly={readonly}
    >
      {isDefined(value) && (
        <>
          <SettingsDatabaseEventsForm
            events={[
              {
                object: object || null,
                action,
                updatedFields: value.updatedFields,
              },
            ]}
            updateOperation={(_, field, fieldValue) =>
              updateEventNamePart({ field, fieldValue })
            }
            removeOperation={() => onChange(null)}
            disabled={readonly}
          />
          <SettingsLogicFunctionTriggerPayloadFormat
            payload={buildDatabaseEventPayload(value)}
            hint={t`Handler Anda menerima objek event ini. "after" berisi kondisi terbaru, "before" kondisi sebelumnya (null untuk rekaman baru), dan "updatedFields" berisi daftar nama kolom yang berubah.`}
          />
        </>
      )}
    </SettingsLogicFunctionTriggerSection>
  );
};
