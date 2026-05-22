import { type BlocklistItem } from '@/accounts/types/BlocklistItem';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { CoreObjectNameSingular } from 'shared/types';
import { useCreateOneRecord } from '@/object-record/hooks/useCreateOneRecord';
import { useDeleteOneRecord } from '@/object-record/hooks/useDeleteOneRecord';
import { useFindManyRecords } from '@/object-record/hooks/useFindManyRecords';
import { SettingsAccountsBlocklistInput } from '@/settings/accounts/components/SettingsAccountsBlocklistInput';
import { SettingsAccountsBlocklistTable } from '@/settings/accounts/components/SettingsAccountsBlocklistTable';
import { useLingui } from '~/utils/i18n/badesI18n';
import { isDefined } from 'shared/utils';
import { H2Title } from 'ui/display';
import { Section } from 'ui/layout';

export const SettingsAccountsBlocklistSection = () => {
  const { t } = useLingui();

  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);

  const currentWorkspaceMemberId = currentWorkspaceMember?.id ?? '';

  const isInternalMessagesImportEnabled =
    currentWorkspace?.isInternalMessagesImportEnabled ?? false;

  const { records: blocklist } = useFindManyRecords<BlocklistItem>({
    objectNameSingular: CoreObjectNameSingular.Blocklist,
    filter: {
      workspaceMemberId: {
        in: [currentWorkspaceMemberId],
      },
    },
    skip: !isDefined(currentWorkspaceMember),
  });

  const { createOneRecord: createBlocklistItem } =
    useCreateOneRecord<BlocklistItem>({
      objectNameSingular: CoreObjectNameSingular.Blocklist,
    });

  const { deleteOneRecord: deleteBlocklistItem } = useDeleteOneRecord({
    objectNameSingular: CoreObjectNameSingular.Blocklist,
  });

  const handleBlockedEmailRemove = (id: string) => {
    deleteBlocklistItem(id);
  };

  const updateBlockedEmailList = (handle: string) => {
    createBlocklistItem({
      handle,
      workspaceMemberId: currentWorkspaceMember?.id,
    });
  };

  return (
    <Section>
      <H2Title
        title={t`Daftar blokir`}
        description={
          isInternalMessagesImportEnabled
            ? t`Kecualikan orang dan domain berikut dari sinkronisasi email saya.`
            : t`Kecualikan orang dan domain berikut dari sinkronisasi email saya. Percakapan internal tidak akan diimpor.`
        }
      />
      <SettingsAccountsBlocklistInput
        blockedEmailOrDomainList={blocklist.map((item) => item.handle)}
        updateBlockedEmailList={updateBlockedEmailList}
      />
      <SettingsAccountsBlocklistTable
        blocklist={blocklist}
        handleBlockedEmailRemove={handleBlockedEmailRemove}
      />
    </Section>
  );
};
