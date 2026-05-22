import { useMutation } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';

import {
  type MessageChannelContactAutoCreationPolicy,
  MessageChannelType,
  type MessageFolderImportPolicy,
} from 'shared/types';
import { H2Title, IconBriefcase, IconUsers } from 'ui/display';
import { Card, Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';

import { type MessageChannel } from '@/accounts/types/MessageChannel';
import { SettingsAccountsMessageAutoCreationCard } from '@/settings/accounts/components/SettingsAccountsMessageAutoCreationCard';
import { SettingsAccountsMessageFolderCard } from '@/settings/accounts/components/SettingsAccountsMessageFolderCard';
import { SettingsAccountsMessageVisibilityCard } from '@/settings/accounts/components/SettingsAccountsMessageVisibilityCard';
import { UPDATE_MESSAGE_CHANNEL } from '@/settings/accounts/graphql/mutations/updateMessageChannel';
import { SettingsOptionCardContentToggle } from '@/settings/components/SettingsOptions/SettingsOptionCardContentToggle';
import { type MessageChannelVisibility } from '~/generated/graphql';

type SettingsAccountsMessageChannelDetailsProps = {
  messageChannel: Pick<
    MessageChannel,
    | 'id'
    | 'visibility'
    | 'contactAutoCreationPolicy'
    | 'excludeNonProfessionalEmails'
    | 'excludeGroupEmails'
    | 'isSyncEnabled'
    | 'messageFolderImportPolicy'
    | 'type'
  >;
};

type MessageChannelUpdateInput = Partial<{
  visibility: MessageChannelVisibility;
  contactAutoCreationPolicy: MessageChannelContactAutoCreationPolicy;
  excludeGroupEmails: boolean;
  excludeNonProfessionalEmails: boolean;
  messageFolderImportPolicy: MessageFolderImportPolicy;
}>;

const StyledDetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[6]};
`;

export const SettingsAccountsMessageChannelDetails = ({
  messageChannel,
}: SettingsAccountsMessageChannelDetailsProps) => {
  const [updateMessageChannel] = useMutation(UPDATE_MESSAGE_CHANNEL);

  const updateChannel = (update: MessageChannelUpdateInput) => {
    updateMessageChannel({
      variables: { input: { id: messageChannel.id, update } },
    });
  };

  const handleVisibilityChange = (value: MessageChannelVisibility) => {
    updateChannel({ visibility: value });
  };

  const handleContactAutoCreationChange = (
    value: MessageChannelContactAutoCreationPolicy,
  ) => {
    updateChannel({ contactAutoCreationPolicy: value });
  };

  const handleIsGroupEmailExcludedToggle = (value: boolean) => {
    updateChannel({ excludeGroupEmails: value });
  };

  const handleIsNonProfessionalEmailExcludedToggle = (value: boolean) => {
    updateChannel({ excludeNonProfessionalEmails: value });
  };

  const handleMessageFolderImportPolicyChange = (
    value: MessageFolderImportPolicy,
  ) => {
    updateChannel({ messageFolderImportPolicy: value });
  };

  const supportsFolderImportPolicy =
    messageChannel.type === MessageChannelType.EMAIL;

  return (
    <StyledDetailsContainer>
      {supportsFolderImportPolicy && (
        <Section>
          <H2Title
            title={t`Impor`}
            description={t`Email dari daftar blokir akan diabaikan. Kelola daftar blokir di halaman pengaturan "Akun".`}
          />
          <SettingsAccountsMessageFolderCard
            onChange={handleMessageFolderImportPolicyChange}
            value={messageChannel.messageFolderImportPolicy}
          />
        </Section>
      )}
      <Section>
        <Card rounded>
          <SettingsOptionCardContentToggle
            Icon={IconUsers}
            title={t`Kecualikan email grup`}
            description={t`Jangan sinkronkan email dari team@ support@ noreply@...`}
            checked={messageChannel.excludeGroupEmails}
            onChange={() =>
              handleIsGroupEmailExcludedToggle(
                !messageChannel.excludeGroupEmails,
              )
            }
          />
        </Card>
      </Section>
      <Section>
        <H2Title
          title={t`Visibilitas`}
          description={t`Tentukan apa yang akan terlihat oleh pengguna lain di Ruang Kerja Anda`}
        />
        <SettingsAccountsMessageVisibilityCard
          value={messageChannel.visibility}
          onChange={handleVisibilityChange}
        />
      </Section>
      <Section>
        <H2Title
          title={t`Pembuatan kontak otomatis`}
          description={t`Otomatis membuat kontak saat menerima atau mengirim email`}
        />
        <SettingsAccountsMessageAutoCreationCard
          value={messageChannel.contactAutoCreationPolicy}
          onChange={handleContactAutoCreationChange}
        />
      </Section>
      <Section>
        <Card rounded>
          <SettingsOptionCardContentToggle
            Icon={IconBriefcase}
            title={t`Kecualikan email non-profesional`}
            description={t`Jangan buat kontak dari/ke email Gmail, Outlook`}
            checked={messageChannel.excludeNonProfessionalEmails}
            onChange={() => {
              handleIsNonProfessionalEmailExcludedToggle(
                !messageChannel.excludeNonProfessionalEmails,
              );
            }}
          />
        </Card>
      </Section>
    </StyledDetailsContainer>
  );
};
