import { useState } from 'react';

import { SettingsRadioCardContainer } from '@/settings/components/SettingsRadioCardContainer';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { H1Title, H1TitleFontColor } from 'ui/display';
import { SectionAlignment, SectionFontColor } from 'ui/layout';
import {
  StyledAppModal,
  StyledAppModalButton,
  StyledAppModalSection,
  StyledAppModalTitle,
} from '~/pages/settings/applications/components/SettingsAppModalLayout';

type SettingsApplicationConnectScopePickerModalProps = {
  modalInstanceId: string;
  providerDisplayName: string;
  onConfirm: (scope: 'user' | 'workspace') => void;
};

export const SettingsApplicationConnectScopePickerModal = ({
  modalInstanceId,
  providerDisplayName,
  onConfirm,
}: SettingsApplicationConnectScopePickerModalProps) => {
  const { closeModal } = useModal();
  const [scope, setScope] = useState<'user' | 'workspace'>('user');

  const options = [
    {
      value: 'user',
      title: `Hanya untuk saya`,
      description: `Hanya Anda yang dapat menggunakan kredensial ini.`,
    },
    {
      value: 'workspace',
      title: `Dibagikan ke ruang kerja`,
      description: `Semua anggota ruang kerja dapat menggunakan kredensial ini.`,
    },
  ];

  return (
    <StyledAppModal modalId={modalInstanceId} isClosable padding="large">
      <StyledAppModalTitle>
        <H1Title
          title={`Sambungkan ${providerDisplayName}`}
          fontColor={H1TitleFontColor.Primary}
        />
      </StyledAppModalTitle>
      <StyledAppModalSection
        alignment={SectionAlignment.Center}
        fontColor={SectionFontColor.Primary}
      >
        <SettingsRadioCardContainer
          value={scope}
          options={options}
          onChange={(value) => setScope(value as 'user' | 'workspace')}
        />
      </StyledAppModalSection>
      <StyledAppModalButton
        onClick={() => closeModal(modalInstanceId)}
        variant="secondary"
        title={`Batal`}
        fullWidth
        justify="center"
      />
      <StyledAppModalButton
        onClick={() => {
          closeModal(modalInstanceId);
          onConfirm(scope);
        }}
        variant="secondary"
        accent="blue"
        title={`Lanjutkan`}
        fullWidth
        justify="center"
      />
    </StyledAppModal>
  );
};
