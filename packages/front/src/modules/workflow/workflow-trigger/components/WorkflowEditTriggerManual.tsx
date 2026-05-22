import { useFilteredObjectMetadataItems } from '@/object-metadata/hooks/useFilteredObjectMetadataItems';
import { useObjectMetadataSelectHelpers } from '@/object-metadata/hooks/useObjectMetadataSelectHelpers';
import { IconPicker } from '@/ui/input/components/IconPicker';
import { Select } from '@/ui/input/components/Select';
import { SelectControl } from '@/ui/input/components/SelectControl';
import { GenericDropdownContentWidth } from '@/ui/layout/dropdown/constants/GenericDropdownContentWidth';
import { type WorkflowManualTrigger } from '@/workflow/types/Workflow';
import { WorkflowStepBody } from '@/workflow/workflow-steps/components/WorkflowStepBody';
import { WorkflowStepFooter } from '@/workflow/workflow-steps/components/WorkflowStepFooter';
import { MANUAL_TRIGGER_AVAILABILITY_TYPE_OPTIONS } from '@/workflow/workflow-trigger/constants/ManualTriggerAvailabilityTypeOptions';
import { MANUAL_TRIGGER_IS_PINNED_OPTIONS } from '@/workflow/workflow-trigger/constants/ManualTriggerIsPinnedOptions';
import { getManualTriggerDefaultSettings } from '@/workflow/workflow-trigger/utils/getManualTriggerDefaultSettings';
import { styled } from '@linaria/react';
import { useLingui } from '~/utils/i18n/badesI18n';
import { QUERY_MAX_RECORDS } from 'shared/constants';
import { isDefined } from 'shared/utils';
import { TRIGGER_STEP_ID } from 'shared/workflow';
import { useIcons } from 'ui/display';
import { type SelectOption } from 'ui/input';
import { themeCssVariables } from 'ui/theme-constants';

type WorkflowEditTriggerManualProps = {
  trigger: WorkflowManualTrigger;
  triggerOptions:
    | {
        readonly: true;
        onTriggerUpdate?: undefined;
      }
    | {
        readonly?: false;
        onTriggerUpdate: (trigger: WorkflowManualTrigger) => void;
      };
};

const StyledLabel = styled.span`
  color: ${themeCssVariables.font.color.light};
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.semiBold};
  margin-bottom: ${themeCssVariables.spacing[1]};
`;

const StyledDescription = styled.span`
  color: ${themeCssVariables.font.color.light};
  font-size: ${themeCssVariables.font.size.sm};
  margin-top: 1px;
`;

const StyledIconPickerContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const WorkflowEditTriggerManual = ({
  trigger,
  triggerOptions,
}: WorkflowEditTriggerManualProps) => {
  const { t } = useLingui();

  const { getIcon } = useIcons();
  const { getSelectIconPropsFromObjectMetadataItem } =
    useObjectMetadataSelectHelpers();
  const maxRecordsFormatted = QUERY_MAX_RECORDS.toLocaleString();

  const { activeNonSystemObjectMetadataItems } =
    useFilteredObjectMetadataItems();

  const availableMetadata: Array<SelectOption<string>> =
    activeNonSystemObjectMetadataItems.map((item) => ({
      label: item.labelPlural,
      value: item.nameSingular,
      ...getSelectIconPropsFromObjectMetadataItem(item),
    }));

  const availability = trigger.settings.availability;

  const availabilityDescriptions = {
    SINGLE_RECORD: t`Data yang dipilih akan diteruskan ke alur kerja`,
    BULK_RECORDS: t`Data yang dipilih (hingga ${maxRecordsFormatted}) akan diteruskan ke alur kerja`,
    GLOBAL: t`Tidak perlu memilih data untuk menjalankan alur kerja ini`,
  };

  return (
    <>
      <WorkflowStepBody>
        <Select
          dropdownId="workflow-edit-manual-trigger-availability"
          label={t`Ketersediaan`}
          description={
            availability?.type
              ? availabilityDescriptions[availability.type]
              : undefined
          }
          fullWidth
          disabled={triggerOptions.readonly}
          value={availability?.type}
          options={MANUAL_TRIGGER_AVAILABILITY_TYPE_OPTIONS}
          onChange={(availabilityType) => {
            if (triggerOptions.readonly === true) {
              return;
            }

            triggerOptions.onTriggerUpdate({
              ...trigger,
              settings: getManualTriggerDefaultSettings({
                availabilityType,
                activeNonSystemObjectMetadataItems,
                icon: trigger.settings.icon,
                isPinned: trigger.settings.isPinned,
              }),
            });
          }}
          dropdownOffset={{ y: 4 }}
          dropdownWidth={GenericDropdownContentWidth.ExtraLarge}
        />

        {availability?.type === 'SINGLE_RECORD' ||
        availability?.type === 'BULK_RECORDS' ? (
          <Select
            dropdownId="workflow-edit-manual-trigger-object"
            label={t`Objek`}
            description={t`Pada objek mana pemicu ini tersedia`}
            fullWidth
            value={availability?.objectNameSingular}
            options={availableMetadata}
            disabled={triggerOptions.readonly}
            onChange={(objectNameSingular) => {
              if (
                triggerOptions.readonly === true ||
                !isDefined(availability)
              ) {
                return;
              }

              triggerOptions.onTriggerUpdate({
                ...trigger,
                settings: {
                  ...trigger.settings,
                  availability: {
                    type: availability.type,
                    objectNameSingular,
                  },
                  objectType: objectNameSingular,
                  outputSchema: {},
                },
              });
            }}
            dropdownOffset={{ y: 4 }}
            dropdownWidth={GenericDropdownContentWidth.ExtraLarge}
          />
        ) : null}

        <IconPicker
          dropdownId="workflow-edit-manual-trigger-icon"
          selectedIconKey={trigger.settings.icon}
          dropdownOffset={{ y: -12 }}
          dropdownWidth={GenericDropdownContentWidth.ExtraLarge}
          maxIconsVisible={9 * 8} // 9 columns * 8 lines
          disabled={triggerOptions.readonly}
          clickableComponent={
            <StyledIconPickerContainer
              onClick={(e) => {
                if (triggerOptions.readonly === true) {
                  e.stopPropagation();
                  e.preventDefault();
                }
              }}
            >
              <StyledLabel>{t`Ikon Perintah`}</StyledLabel>
              <SelectControl
                isDisabled={triggerOptions.readonly}
                selectedOption={{
                  Icon: getIcon(trigger.settings.icon),
                  value: trigger.settings.icon || null,
                  label: '',
                }}
              />
              <StyledDescription>{t`Ikon yang ditampilkan pemicu alur kerja di menu perintah`}</StyledDescription>
            </StyledIconPickerContainer>
          }
          onChange={({ iconKey }) => {
            if (triggerOptions.readonly === true) {
              return;
            }

            triggerOptions.onTriggerUpdate({
              ...trigger,
              settings: {
                ...trigger.settings,
                icon: iconKey,
              },
            });
          }}
        />

        <Select
          dropdownId="workflow-edit-manual-trigger-navbar"
          label={t`Bilah Atas`}
          description={t`Tampilkan tombol di bilah atas untuk menjalankan alur kerja ini`}
          fullWidth
          value={trigger.settings.isPinned}
          options={MANUAL_TRIGGER_IS_PINNED_OPTIONS}
          disabled={triggerOptions.readonly}
          onChange={(updatedValue) => {
            if (triggerOptions.readonly === true) {
              return;
            }

            triggerOptions.onTriggerUpdate({
              ...trigger,
              settings: {
                ...trigger.settings,
                isPinned: updatedValue,
                outputSchema: {},
              },
            });
          }}
          dropdownOffset={{ y: 4 }}
          dropdownWidth={GenericDropdownContentWidth.ExtraLarge}
        />
      </WorkflowStepBody>
      {!triggerOptions.readonly && (
        <WorkflowStepFooter stepId={TRIGGER_STEP_ID} />
      )}
    </>
  );
};
