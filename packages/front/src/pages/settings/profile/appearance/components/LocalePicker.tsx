import { styled } from '@linaria/react';

import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { getDateFnsLocale } from '@/ui/field/display/utils/getDateFnsLocale';
import { Select } from '@/ui/input/components/Select';
import { useUpdateWorkspaceMemberSettings } from '@/settings/profile/hooks/useUpdateWorkspaceMemberSettings';

import { useInvalidateMetadataStore } from '@/metadata-store/hooks/useInvalidateMetadataStore';
import { useStore } from 'jotai';
import { useLingui } from '@lingui/react/macro';
import { enUS } from 'date-fns/locale';
import { APP_LOCALES } from 'shared/translations';
import { isDefined } from 'shared/utils';
import { dateLocaleState } from '~/localization/states/dateLocaleState';
import { themeCssVariables } from 'ui/theme-constants';
import { dynamicActivate } from '~/utils/i18n/dynamicActivate';
import { logError } from '~/utils/logError';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
`;

export const LocalePicker = () => {
  const { t } = useLingui();
  const store = useStore();
  const [currentWorkspaceMember, setCurrentWorkspaceMember] = useAtomState(
    currentWorkspaceMemberState,
  );
  const { updateWorkspaceMemberSettings } = useUpdateWorkspaceMemberSettings();

  const { invalidateMetadataStore } = useInvalidateMetadataStore();

  const updateWorkspaceMember = async (changedFields: any) => {
    if (!currentWorkspaceMember?.id) {
      throw new Error('User is not logged in');
    }

    try {
      await updateWorkspaceMemberSettings({
        workspaceMemberId: currentWorkspaceMember.id,
        update: changedFields,
      });
    } catch (error) {
      logError(error);
    }
  };

  if (!isDefined(currentWorkspaceMember)) return;

  const handleLocaleChange = async (value: keyof typeof APP_LOCALES) => {
    setCurrentWorkspaceMember({
      ...currentWorkspaceMember,
      ...{ locale: value },
    });
    await updateWorkspaceMember({ locale: value });

    const dateFnsLocale = await getDateFnsLocale(value);
    const newDateLocale = {
      locale: value,
      localeCatalog: dateFnsLocale || enUS,
    };
    store.set(dateLocaleState.atom, newDateLocale);

    await dynamicActivate(value);
    try {
      localStorage.setItem('locale', value);
    } catch (error) {
      // oxlint-disable-next-line no-console
      console.log('Failed to save locale to localStorage:', error);
    }
    invalidateMetadataStore();
  };

  const localeOptions: Array<{
    label: string;
    value: (typeof APP_LOCALES)[keyof typeof APP_LOCALES];
  }> = [
    {
      label: t`Indonesia`,
      value: APP_LOCALES['id-ID'],
    },
    {
      label: ""English",
      value: APP_LOCALES.en,
    },
  ];

  return (
    <StyledContainer>
      <Select
        dropdownId="preferred-locale"
        dropdownWidthAuto
        fullWidth
        value={currentWorkspaceMember.locale}
        options={localeOptions}
        onChange={(value) =>
          handleLocaleChange(value as keyof typeof APP_LOCALES)
        }
      />
    </StyledContainer>
  );
};
