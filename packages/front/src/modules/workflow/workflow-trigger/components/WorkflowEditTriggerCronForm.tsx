import { FormNumberFieldInput } from '@/object-record/record-field/ui/form-types/components/FormNumberFieldInput';
import { FormSelectFieldInput } from '@/object-record/record-field/ui/form-types/components/FormSelectFieldInput';
import { FormTextFieldInput } from '@/object-record/record-field/ui/form-types/components/FormTextFieldInput';
import { type WorkflowCronTrigger } from '@/workflow/types/Workflow';
import { WorkflowStepBody } from '@/workflow/workflow-steps/components/WorkflowStepBody';
import { WorkflowStepFooter } from '@/workflow/workflow-steps/components/WorkflowStepFooter';
import { CronExpressionHelperLazy } from '@/workflow/workflow-trigger/components/CronExpressionHelperLazy';
import {
  CRON_TRIGGER_INTERVAL_OPTIONS,
  type CronTriggerInterval,
} from '@/workflow/workflow-trigger/constants/CronTriggerIntervalOptions';
import { getCronTriggerDefaultSettings } from '@/workflow/workflow-trigger/utils/getCronTriggerDefaultSettings';
import { getTriggerScheduleDescription } from '@/workflow/workflow-trigger/utils/getTriggerScheduleDescription';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { t } from '@lingui/core/macro';
import { isNumber } from '@sniptt/guards';
import { useState } from 'react';
import { isDefined } from 'shared/utils';
import { TRIGGER_STEP_ID } from 'shared/workflow';
import { dateLocaleState } from '~/localization/states/dateLocaleState';

type WorkflowEditTriggerCronFormProps = {
  trigger: WorkflowCronTrigger;
  triggerOptions:
    | {
        readonly: true;
        onTriggerUpdate?: undefined;
      }
    | {
        readonly?: false;
        onTriggerUpdate: (trigger: WorkflowCronTrigger) => void;
      };
};

type FormErrorMessages = {
  CUSTOM?: string | undefined;
  DAYS_day?: string | undefined;
  DAYS_hour?: string | undefined;
  DAYS_minute?: string | undefined;
  HOURS_hour?: string | undefined;
  HOURS_minute?: string | undefined;
  MINUTES?: string | undefined;
};

export const WorkflowEditTriggerCronForm = ({
  trigger,
  triggerOptions,
}: WorkflowEditTriggerCronFormProps) => {
  const [errorMessages, setErrorMessages] = useState<FormErrorMessages>({});
  const [errorMessagesVisible, setErrorMessagesVisible] = useState(false);
  const dateLocale = useAtomStateValue(dateLocaleState);

  const customDescription = getTriggerScheduleDescription(
    trigger,
    dateLocale.localeCatalog,
  );

  const onBlur = () => {
    setErrorMessagesVisible(true);
  };

  return (
    <>
      <WorkflowStepBody>
        <FormSelectFieldInput
          label={t`Interval pemicu`}
          hint={t`Penjadwalan akan dijalankan pada waktu UTC`}
          defaultValue={trigger.settings.type}
          options={CRON_TRIGGER_INTERVAL_OPTIONS}
          readonly={triggerOptions.readonly}
          onChange={(newTriggerType) => {
            if (triggerOptions.readonly === true) {
              return;
            }
            if (!newTriggerType) {
              return;
            }
            setErrorMessages({});

            setErrorMessagesVisible(false);

            triggerOptions.onTriggerUpdate({
              ...trigger,
              settings: getCronTriggerDefaultSettings(
                newTriggerType as CronTriggerInterval,
              ),
            });
          }}
        />
        {trigger.settings.type === 'CUSTOM' && (
          <>
            <FormTextFieldInput
              label={t`Ekspresi`}
              placeholder={t`0 */1 * * *`}
              error={errorMessagesVisible ? errorMessages.CUSTOM : undefined}
              onBlur={onBlur}
              hint={customDescription ?? ''}
              readonly={triggerOptions.readonly}
              defaultValue={trigger.settings.pattern}
              onChange={async (newPattern: string) => {
                if (triggerOptions.readonly === true) {
                  return;
                }

                const { CronExpressionParser } = await import('cron-parser');

                try {
                  CronExpressionParser.parse(newPattern);
                } catch (error) {
                  const unknownError = t`Kesalahan tidak diketahui`;
                  const errorMessage =
                    error instanceof Error ? error.message : unknownError;
                  setErrorMessages({
                    CUSTOM: t`Pola cron tidak valid: ${errorMessage}`,
                  });
                  return;
                }

                setErrorMessages((prev) => ({
                  ...prev,
                  CUSTOM: undefined,
                }));

                triggerOptions.onTriggerUpdate({
                  ...trigger,
                  settings: {
                    ...trigger.settings,
                    type: 'CUSTOM',
                    pattern: newPattern,
                  },
                });
              }}
            />
            <CronExpressionHelperLazy
              trigger={trigger}
              isVisible={!!trigger.settings.pattern && !errorMessages.CUSTOM}
              isScheduleVisible={false}
            />
          </>
        )}
        {trigger.settings.type === 'DAYS' && (
          <>
            <FormNumberFieldInput
              label={t`Jarak hari antar pemicu`}
              error={errorMessagesVisible ? errorMessages.DAYS_day : undefined}
              onBlur={onBlur}
              defaultValue={trigger.settings.schedule.day}
              onChange={(newDay) => {
                if (triggerOptions.readonly === true) {
                  return;
                }

                if (!isDefined(newDay)) {
                  return;
                }

                if (!isNumber(newDay) || newDay <= 0) {
                  setErrorMessages((prev) => ({
                    ...prev,
                    DAYS_day: t`Nilai hari tidak valid '${newDay}'. Harus bilangan bulat lebih dari 1`,
                  }));
                  return;
                }

                setErrorMessages((prev) => ({
                  ...prev,
                  DAYS_day: undefined,
                }));

                triggerOptions.onTriggerUpdate({
                  ...trigger,
                  settings: {
                    ...trigger.settings,
                    type: 'DAYS',
                    schedule: {
                      day: newDay,
                      hour:
                        trigger.settings.type === 'DAYS'
                          ? trigger.settings.schedule.hour
                          : 0,
                      minute:
                        trigger.settings.type === 'DAYS'
                          ? trigger.settings.schedule.minute
                          : 0,
                    },
                  },
                });
              }}
              placeholder={t`Masukkan angka lebih dari 1`}
              readonly={triggerOptions.readonly}
            />
            <FormNumberFieldInput
              label={t`Pemicu pada jam (UTC)`}
              error={errorMessagesVisible ? errorMessages.DAYS_hour : undefined}
              onBlur={onBlur}
              defaultValue={trigger.settings.schedule.hour}
              onChange={(newHour) => {
                if (triggerOptions.readonly === true) {
                  return;
                }

                if (!isDefined(newHour)) {
                  return;
                }

                if (!isNumber(newHour) || newHour < 0 || newHour > 23) {
                  setErrorMessages((prev) => ({
                    ...prev,
                    DAYS_hour: t`Nilai jam tidak valid '${newHour}'. Harus bilangan bulat antara 0 dan 23`,
                  }));
                  return;
                }

                setErrorMessages((prev) => ({
                  ...prev,
                  DAYS_hour: undefined,
                }));

                triggerOptions.onTriggerUpdate({
                  ...trigger,
                  settings: {
                    ...trigger.settings,
                    type: 'DAYS',
                    schedule: {
                      day:
                        trigger.settings.type === 'DAYS'
                          ? trigger.settings.schedule.day
                          : 1,
                      hour: newHour,
                      minute:
                        trigger.settings.type === 'DAYS'
                          ? trigger.settings.schedule.minute
                          : 0,
                    },
                  },
                });
              }}
              placeholder={t`Masukkan angka antara 0 dan 23`}
              readonly={triggerOptions.readonly}
            />
            <FormNumberFieldInput
              label={t`Pemicu pada menit (UTC)`}
              error={
                errorMessagesVisible ? errorMessages.DAYS_minute : undefined
              }
              onBlur={onBlur}
              defaultValue={trigger.settings.schedule.minute}
              onChange={(newMinute) => {
                if (triggerOptions.readonly === true) {
                  return;
                }

                if (!isDefined(newMinute)) {
                  return;
                }

                if (!isNumber(newMinute) || newMinute < 0 || newMinute > 59) {
                  setErrorMessages((prev) => ({
                    ...prev,
                    DAYS_minute: t`Nilai menit tidak valid '${newMinute}'. Harus bilangan bulat antara 0 dan 59`,
                  }));
                  return;
                }

                setErrorMessages((prev) => ({
                  ...prev,
                  DAYS_minute: undefined,
                }));

                triggerOptions.onTriggerUpdate({
                  ...trigger,
                  settings: {
                    ...trigger.settings,
                    type: 'DAYS',
                    schedule: {
                      day:
                        trigger.settings.type === 'DAYS'
                          ? trigger.settings.schedule.day
                          : 1,
                      hour:
                        trigger.settings.type === 'DAYS'
                          ? trigger.settings.schedule.hour
                          : 0,
                      minute: newMinute,
                    },
                  },
                });
              }}
              placeholder={t`Masukkan angka antara 0 dan 59`}
              readonly={triggerOptions.readonly}
            />
            <CronExpressionHelperLazy
              trigger={trigger}
              isVisible={
                !errorMessages.DAYS_day &&
                !errorMessages.DAYS_hour &&
                !errorMessages.DAYS_minute
              }
            />
          </>
        )}
        {trigger.settings.type === 'HOURS' && (
          <>
            <FormNumberFieldInput
              label={t`Jarak jam antar pemicu`}
              error={
                errorMessagesVisible ? errorMessages.HOURS_hour : undefined
              }
              onBlur={onBlur}
              defaultValue={trigger.settings.schedule.hour}
              onChange={(newHour) => {
                if (triggerOptions.readonly === true) {
                  return;
                }

                if (!isDefined(newHour)) {
                  return;
                }

                if (!isNumber(newHour) || newHour <= 0) {
                  setErrorMessages((prev) => ({
                    ...prev,
                    HOURS_hour: t`Nilai jam tidak valid '${newHour}'. Harus bilangan bulat lebih dari 1`,
                  }));
                  return;
                }

                setErrorMessages((prev) => ({
                  ...prev,
                  HOURS_hour: undefined,
                }));

                triggerOptions.onTriggerUpdate({
                  ...trigger,
                  settings: {
                    ...trigger.settings,
                    type: 'HOURS',
                    schedule: {
                      hour: newHour,
                      minute:
                        trigger.settings.type === 'HOURS'
                          ? trigger.settings.schedule.minute
                          : 0,
                    },
                  },
                });
              }}
              placeholder={t`Masukkan angka lebih dari 1`}
              readonly={triggerOptions.readonly}
            />
            <FormNumberFieldInput
              label={t`Pemicu pada menit (UTC)`}
              error={
                errorMessagesVisible ? errorMessages.HOURS_minute : undefined
              }
              onBlur={onBlur}
              defaultValue={trigger.settings.schedule.minute}
              onChange={(newMinute) => {
                if (triggerOptions.readonly === true) {
                  return;
                }

                if (!isDefined(newMinute)) {
                  return;
                }

                if (!isNumber(newMinute) || newMinute < 0 || newMinute > 59) {
                  setErrorMessages((prev) => ({
                    ...prev,
                    HOURS_minute: t`Nilai menit tidak valid '${newMinute}'. Harus bilangan bulat antara 0 dan 59`,
                  }));
                  return;
                }

                setErrorMessages((prev) => ({
                  ...prev,
                  HOURS_minute: undefined,
                }));

                triggerOptions.onTriggerUpdate({
                  ...trigger,
                  settings: {
                    ...trigger.settings,
                    type: 'HOURS',
                    schedule: {
                      hour:
                        trigger.settings.type === 'HOURS'
                          ? trigger.settings.schedule.hour
                          : 1,
                      minute: newMinute,
                    },
                  },
                });
              }}
              placeholder={t`Masukkan angka antara 0 dan 59`}
              readonly={triggerOptions.readonly}
            />
            <CronExpressionHelperLazy
              trigger={trigger}
              isVisible={
                !errorMessages.HOURS_hour && !errorMessages.HOURS_minute
              }
            />
          </>
        )}
        {trigger.settings.type === 'MINUTES' && (
          <>
            <FormNumberFieldInput
              label={t`Jarak menit antar pemicu`}
              error={errorMessagesVisible ? errorMessages.MINUTES : undefined}
              onBlur={onBlur}
              defaultValue={trigger.settings.schedule.minute}
              onChange={(newMinute) => {
                if (triggerOptions.readonly === true) {
                  return;
                }

                if (!isDefined(newMinute)) {
                  return;
                }

                if (!isNumber(newMinute) || newMinute <= 0) {
                  setErrorMessages({
                    MINUTES: t`Nilai menit tidak valid '${newMinute}'. Harus bilangan bulat lebih dari 1`,
                  });
                  return;
                }

                if (newMinute > 60) {
                  setErrorMessages({
                    MINUTES: t`Nilai menit tidak boleh melebihi 60. Untuk interval lebih dari 60 menit, gunakan tipe pemicu "Jam" atau ekspresi cron kustom`,
                  });
                  return;
                }

                setErrorMessages((prev) => ({
                  ...prev,
                  MINUTES: undefined,
                }));

                triggerOptions.onTriggerUpdate({
                  ...trigger,
                  settings: {
                    ...trigger.settings,
                    type: 'MINUTES',
                    schedule: {
                      minute: newMinute,
                    },
                  },
                });
              }}
              placeholder={t`Masukkan angka antara 1 dan 60`}
              readonly={triggerOptions.readonly}
            />
            <CronExpressionHelperLazy
              trigger={trigger}
              isVisible={!errorMessages.MINUTES}
            />
          </>
        )}
      </WorkflowStepBody>
      {!triggerOptions.readonly && (
        <WorkflowStepFooter stepId={TRIGGER_STEP_ID} />
      )}
    </>
  );
};
