import { Trans, useLingui } from '~/utils/i18n/badesI18n';
import { useCallback, useState } from 'react';

import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { SubscriptionInfoContainer } from '@/settings/billing/components/SubscriptionInfoContainer';
import { SubscriptionInfoRowContainer } from '@/settings/billing/components/internal/SubscriptionInfoRowContainer';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SET_ENTERPRISE_KEY } from '@/settings/enterprise/graphql/mutations/setEnterpriseKey';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useLoadCurrentUser } from '@/users/hooks/useLoadCurrentUser';
import { useMutation } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title, IconCheck, IconKey } from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';
import { isGraphqlErrorOfType } from '~/utils/is-graphql-error-of-type.util';

type SettingsEnterpriseProps = {
  isAdminPanelTab?: boolean;
};

const StyledStatusDot = styled.div<{ isActive: boolean }>`
  background-color: ${({ isActive }) =>
    isActive ? themeCssVariables.color.green : themeCssVariables.color.red};
  border-radius: 50%;
  height: 8px;
  width: 8px;
`;

const StyledStatusContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
`;

const StyledInputContainer = styled.div`
  display: flex;
  gap: ${themeCssVariables.spacing[2]};
  width: 100%;
`;

const StyledInputWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

const StyledActivateButtonWrapper = styled.div`
  flex-shrink: 0;
`;

/**
 * Panel internal tim Bades untuk mengaktifkan kapabilitas enterprise
 * (SSO, keamanan tingkat baris, log audit) pada sebuah ruang kerja.
 * Aktivasi memakai kunci lisensi yang dikelola tim Bades, bukan pembelian
 * mandiri oleh pengguna.
 */
export const SettingsEnterprise = ({
  isAdminPanelTab = false,
}: SettingsEnterpriseProps = {}) => {
  const { t } = useLingui();
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const [enterpriseKey, setEnterpriseKey] = useState('');
  const [isActivating, setIsActivating] = useState(false);
  const [setEnterpriseKeyMutation] = useMutation<{
    setEnterpriseKey: {
      isValid: boolean;
      licensee: string | null;
      expiresAt: string | null;
      subscriptionId: string | null;
    };
  }>(SET_ENTERPRISE_KEY);
  const { enqueueErrorSnackBar, enqueueSuccessSnackBar } = useSnackBar();
  const { loadCurrentUser } = useLoadCurrentUser();

  const isEnterpriseActive =
    currentWorkspace?.hasValidEnterpriseValidityToken === true;

  const handleActivate = useCallback(async () => {
    if (!enterpriseKey.trim()) return;

    setIsActivating(true);

    try {
      const result = await setEnterpriseKeyMutation({
        variables: { enterpriseKey: enterpriseKey.trim() },
      });

      if (result.data?.setEnterpriseKey.isValid === true) {
        enqueueSuccessSnackBar({
          message: t`Lisensi enterprise berhasil diaktifkan.`,
        });
        setEnterpriseKey('');
        await loadCurrentUser();
      } else {
        enqueueErrorSnackBar({
          message: t`Gagal mengaktifkan lisensi enterprise. Periksa kunci lisensi atau hubungi tim Bades.`,
        });
      }
    } catch (error) {
      if (isGraphqlErrorOfType(error, 'CONFIG_VARIABLES_IN_DB_DISABLED')) {
        enqueueErrorSnackBar({
          apolloError: error,
          options: { duration: 10000 },
        });
      } else {
        enqueueErrorSnackBar({
          message: t`Terjadi kesalahan saat mengaktifkan lisensi enterprise.`,
        });
      }
    } finally {
      setIsActivating(false);
    }
  }, [
    enterpriseKey,
    setEnterpriseKeyMutation,
    enqueueErrorSnackBar,
    enqueueSuccessSnackBar,
    loadCurrentUser,
    t,
  ]);

  const innerContent = (
    <>
      <Section>
        <H2Title
          title={t`Lisensi enterprise`}
          description={
            isEnterpriseActive
              ? t`Kapabilitas enterprise pada ruang kerja ini aktif.`
              : t`Kapabilitas enterprise membuka fitur seperti SSO, keamanan tingkat baris, dan log audit. Hubungi tim Bades untuk mendapatkan kunci lisensi.`
          }
        />
        {isEnterpriseActive && (
          <SubscriptionInfoContainer>
            <SubscriptionInfoRowContainer
              label={t`Status`}
              Icon={IconCheck}
              currentValue={
                <StyledStatusContainer>
                  <StyledStatusDot isActive={true} />
                  <Trans>Aktif</Trans>
                </StyledStatusContainer>
              }
            />
          </SubscriptionInfoContainer>
        )}
      </Section>
      <Section>
        <H2Title
          title={t`Aktifkan kunci lisensi`}
          description={t`Tempel kunci lisensi enterprise dari tim Bades untuk mengaktifkannya.`}
        />
        <StyledInputContainer>
          <StyledInputWrapper>
            <SettingsTextInput
              instanceId="enterprise-key-input"
              value={enterpriseKey}
              onChange={(value) => setEnterpriseKey(value)}
              placeholder={t`Tempel kunci lisensi enterprise di sini`}
              fullWidth
              onInputEnter={handleActivate}
            />
          </StyledInputWrapper>
          <StyledActivateButtonWrapper>
            <Button
              Icon={IconKey}
              title={isActivating ? t`Mengaktifkan...` : t`Aktifkan`}
              accent="blue"
              onClick={handleActivate}
              disabled={isActivating || !enterpriseKey.trim()}
            />
          </StyledActivateButtonWrapper>
        </StyledInputContainer>
      </Section>
    </>
  );

  if (isAdminPanelTab) {
    return innerContent;
  }

  return (
    <SubMenuTopBarContainer
      title={'Enterprise'}
      links={[
        {
          children: <Trans>Ruang Kerja</Trans>,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: 'Enterprise' },
      ]}
    >
      <SettingsPageContainer>{innerContent}</SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
