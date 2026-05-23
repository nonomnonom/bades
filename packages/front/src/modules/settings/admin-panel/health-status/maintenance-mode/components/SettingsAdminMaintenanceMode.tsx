import { useMutation } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { t } from '~/utils/i18n/badesI18n';
import { isNonEmptyString } from '@sniptt/guards';
import { useCallback } from 'react';
import { isDefined } from 'shared/utils';
import { H2Title, IconLink, IconTool, Status } from 'ui/display';
import { Card, CardContent, Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';

import { maintenanceModeState } from '@/client-config/states/maintenanceModeState';
import { useApolloAdminClient } from '@/settings/admin-panel/apollo/hooks/useApolloAdminClient';
import { CLEAR_MAINTENANCE_MODE } from '@/settings/admin-panel/health-status/maintenance-mode/graphql/mutations/clearMaintenanceMode';
import { SET_MAINTENANCE_MODE } from '@/settings/admin-panel/health-status/maintenance-mode/graphql/mutations/setMaintenanceMode';
import { adminPanelMaintenanceModeState } from '@/settings/admin-panel/health-status/maintenance-mode/states/adminPanelMaintenanceModeState';
import { SettingsDatePickerInput } from '@/settings/components/SettingsDatePickerInput';
import { SettingsOptionCardContentToggle } from '@/settings/components/SettingsOptions/SettingsOptionCardContentToggle';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { InputHint } from '@/ui/input/components/InputHint';
import { TextInput } from '@/ui/input/components/TextInput';
import { useUserTimezone } from '@/ui/input/components/internal/date/hooks/useUserTimezone';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
`;

const StyledStatusRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const SettingsAdminMaintenanceMode = () => {
  const apolloAdminClient = useApolloAdminClient();
  const [adminPanelMaintenanceMode, setAdminPanelMaintenanceMode] =
    useAtomState(adminPanelMaintenanceModeState);

  const maintenanceMode = useAtomStateValue(maintenanceModeState);
  const setMaintenanceMode = useSetAtomState(maintenanceModeState);

  const { userTimezone } = useUserTimezone();
  const { enqueueErrorSnackBar } = useSnackBar();

  const [setMaintenanceModeMutation] = useMutation(SET_MAINTENANCE_MODE, {
    client: apolloAdminClient,
  });
  const [clearMaintenanceModeMutation] = useMutation(CLEAR_MAINTENANCE_MODE, {
    client: apolloAdminClient,
  });

  const isEnabled = isDefined(adminPanelMaintenanceMode);

  const startDate =
    isEnabled && isNonEmptyString(adminPanelMaintenanceMode.startAt)
      ? new Date(adminPanelMaintenanceMode.startAt)
      : undefined;

  const endDate =
    isEnabled && isNonEmptyString(adminPanelMaintenanceMode.endAt)
      ? new Date(adminPanelMaintenanceMode.endAt)
      : undefined;

  const hasValidDateRange =
    isDefined(startDate) &&
    isDefined(endDate) &&
    endDate.getTime() > startDate.getTime();

  const isScheduled =
    isDefined(maintenanceMode) &&
    isNonEmptyString(maintenanceMode.startAt) &&
    isNonEmptyString(maintenanceMode.endAt);

  const saveToBackend = useCallback(
    async (startAt: string, endAt: string, link?: string) => {
      if (!isNonEmptyString(startAt) || !isNonEmptyString(endAt)) {
        return;
      }

      if (new Date(endAt).getTime() <= new Date(startAt).getTime()) {
        return;
      }

      try {
        await setMaintenanceModeMutation({
          variables: { startAt, endAt, link },
        });

        setMaintenanceMode({
          startAt,
          endAt,
          link,
        });
      } catch (error: unknown) {
        enqueueErrorSnackBar({
          message:
            error instanceof Error
              ? error.message
              : t`Gagal mengatur mode pemeliharaan.`,
        });
      }
    },
    [setMaintenanceModeMutation, setMaintenanceMode, enqueueErrorSnackBar],
  );

  const handleToggle = useCallback(
    async (checked: boolean) => {
      if (checked) {
        setAdminPanelMaintenanceMode({ startAt: '', endAt: '' });
      } else {
        await clearMaintenanceModeMutation();
        setAdminPanelMaintenanceMode(null);
        setMaintenanceMode(null);
      }
    },
    [
      clearMaintenanceModeMutation,
      setAdminPanelMaintenanceMode,
      setMaintenanceMode,
    ],
  );

  const handleDateChange = useCallback(
    (field: 'startAt' | 'endAt') => (value: Date | undefined) => {
      if (!isDefined(adminPanelMaintenanceMode)) {
        return;
      }

      const isoValue = isDefined(value) ? value.toISOString() : '';
      const nextState = { ...adminPanelMaintenanceMode, [field]: isoValue };

      setAdminPanelMaintenanceMode(nextState);
      saveToBackend(
        nextState.startAt,
        nextState.endAt,
        isNonEmptyString(nextState.link) ? nextState.link : undefined,
      );
    },
    [adminPanelMaintenanceMode, setAdminPanelMaintenanceMode, saveToBackend],
  );

  const handleLinkChange = useCallback(
    (value: string) => {
      if (!isDefined(adminPanelMaintenanceMode)) {
        return;
      }

      setAdminPanelMaintenanceMode({
        ...adminPanelMaintenanceMode,
        link: value,
      });
    },
    [adminPanelMaintenanceMode, setAdminPanelMaintenanceMode],
  );

  const handleLinkBlur = useCallback(() => {
    if (!isDefined(adminPanelMaintenanceMode)) {
      return;
    }

    saveToBackend(
      adminPanelMaintenanceMode.startAt,
      adminPanelMaintenanceMode.endAt,
      isNonEmptyString(adminPanelMaintenanceMode.link)
        ? adminPanelMaintenanceMode.link
        : undefined,
    );
  }, [adminPanelMaintenanceMode, saveToBackend]);

  const scheduledStartDate = isScheduled
    ? new Date(maintenanceMode.startAt)
    : undefined;

  const formattedStartDate = isDefined(scheduledStartDate)
    ? scheduledStartDate.toLocaleDateString(undefined, {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        timeZone: userTimezone,
      })
    : '';

  const toggleDescription = isScheduled
    ? t`Direncanakan untuk ${formattedStartDate}`
    : undefined;

  return (
    <Section>
      <H2Title
        title={t`Pemeliharaan`}
        description={t`Jadwalkan jendela pemeliharaan dan beri tahu semua pengguna`}
      />
      <Card rounded>
        <SettingsOptionCardContentToggle
          Icon={IconTool}
          title={t`Mode pemeliharaan`}
          description={toggleDescription}
          checked={isEnabled}
          onChange={handleToggle}
        />
        {isEnabled && (
          <CardContent>
            <StyledFormContainer>
              <SettingsDatePickerInput
                label={t`Tanggal mulai`}
                value={startDate}
                onChange={handleDateChange('startAt')}
              />
              <div>
                <SettingsDatePickerInput
                  label={t`Tanggal selesai`}
                  value={endDate}
                  onChange={handleDateChange('endAt')}
                />
                {isDefined(startDate) &&
                  isDefined(endDate) &&
                  !hasValidDateRange && (
                    <InputHint>{t`Tanggal selesai harus setelah tanggal mulai.`}</InputHint>
                  )}
              </div>
              <div>
                <TextInput
                  label={t`Tautan`}
                  type="url"
                  value={adminPanelMaintenanceMode.link ?? ''}
                  onChange={handleLinkChange}
                  onBlur={handleLinkBlur}
                  LeftIcon={IconLink}
                  placeholder="https://status.example.com"
                  fullWidth
                />
                <InputHint>
                  {t`Jika tidak ada tautan, tombol tidak akan muncul.`}
                </InputHint>
              </div>
              {isScheduled && (
                <StyledStatusRow>
                  <Status
                    color="orange"
                    text={t`Direncanakan untuk ${formattedStartDate}`}
                  />
                </StyledStatusRow>
              )}
            </StyledFormContainer>
          </CardContent>
        )}
      </Card>
    </Section>
  );
};
