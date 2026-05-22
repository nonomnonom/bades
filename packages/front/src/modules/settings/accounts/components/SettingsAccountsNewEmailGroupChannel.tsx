import { useLingui } from '~/utils/i18n/badesI18n';
import { useCallback, useState } from 'react';
import { z } from 'zod';

import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title } from 'ui/display';
import { Section } from 'ui/layout';

import { useCreateEmailGroupChannel } from '@/settings/accounts/hooks/useCreateEmailGroupChannel';
import { SaveAndCancelButtons } from '@/settings/components/SaveAndCancelButtons/SaveAndCancelButtons';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

export const SettingsAccountsNewEmailGroupChannel = () => {
  const { t } = useLingui();
  const navigate = useNavigateSettings();
  const { enqueueErrorSnackBar } = useSnackBar();
  const { createEmailGroupChannel, loading } = useCreateEmailGroupChannel();

  const [handle, setHandle] = useState('');

  const isHandleValidEmail = z.email().safeParse(handle).success;
  const canSave = isHandleValidEmail && !loading;

  const handleSave = useCallback(async () => {
    try {
      const result = await createEmailGroupChannel(handle);
      const messageChannelId =
        result.data?.createEmailGroupChannel.messageChannel.id;

      if (messageChannelId) {
        navigate(SettingsPath.EmailGroupChannelDetail, {
          messageChannelId,
        });
      }
    } catch {
      enqueueErrorSnackBar({
        message: t`Gagal membuat saluran grup email. Grup email mungkin belum dikonfigurasi di server ini.`,
      });
    }
  }, [createEmailGroupChannel, handle, navigate, enqueueErrorSnackBar, t]);

  return (
    <SubMenuTopBarContainer
      title={t`Grup Email Baru`}
      links={[
        {
          children: t`Ruang Kerja`,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        {
          children: t`Umum`,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: t`Grup Email Baru` },
      ]}
      actionButton={
        <SaveAndCancelButtons
          isSaveDisabled={!canSave}
          isCancelDisabled={loading}
          isLoading={loading}
          onCancel={() => navigate(SettingsPath.Workspace)}
          onSave={handleSave}
        />
      }
    >
      <SettingsPageContainer>
        <Section>
          <H2Title
            title={t`Alamat Email`}
            description={t`Masukkan alamat email yang ingin Anda teruskan emailnya (mis. support@mycompany.com).`}
          />
          <SettingsTextInput
            instanceId="email-group-handle"
            label={t`Alamat Email Sumber`}
            placeholder="support@mycompany.com"
            value={handle}
            onChange={setHandle}
            disabled={loading}
          />
        </Section>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
