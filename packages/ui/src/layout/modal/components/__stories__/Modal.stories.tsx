import { styled } from '@linaria/react';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { H1Title, H1TitleFontColor, H2Title, IconX } from '@ui/display';
import { Button, IconButton } from '@ui/input';
import { Section, SectionAlignment, SectionFontColor } from '@ui/layout';
import { ComponentDecorator } from '@ui/testing';
import { themeCssVariables } from '@ui/theme-constants';

import { Modal } from '../Modal';
import { ModalContent } from '../ModalContent';
import { ModalFooter } from '../ModalFooter';
import { ModalHeader } from '../ModalHeader';

const StyledCenteredTitle = styled.div`
  text-align: center;
`;

const StyledSectionContainer = styled.div`
  margin-bottom: ${themeCssVariables.spacing[6]};
`;

const meta: Meta<typeof Modal> = {
  title: 'UI/Layout/Modal/Modal',
  component: Modal,
  decorators: [ComponentDecorator],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'extraLarge'],
    },
    padding: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
    },
    overlay: {
      control: 'select',
      options: ['light', 'dark', 'transparent'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  args: {
    isOpen: true,
    size: 'medium',
    padding: 'none',
    overlay: 'dark',
  },
  render: ({ isOpen, size, padding, overlay }) => (
    <Modal isOpen={isOpen} size={size} padding={padding} overlay={overlay}>
      <ModalHeader>
        <H2Title
          title="Edit ruang kerja"
          description="Perbarui pengaturan ruang kerja Anda"
        />
      </ModalHeader>
      <ModalContent>
        <Section>
          Nama dan subdomain ruang kerja dapat diubah dari panel pengaturan.
          Perubahan akan berlaku untuk semua anggota.
        </Section>
      </ModalContent>
      <ModalFooter>
        <Button title="Batal" variant="secondary" />
        <Button title="Simpan" variant="primary" accent="blue" />
      </ModalFooter>
    </Modal>
  ),
};

export const Confirmation: Story = {
  args: {
    isOpen: true,
    padding: 'large',
    overlay: 'dark',
    smallBorderRadius: true,
    narrowWidth: true,
    autoHeight: true,
    gap: 2,
  },
  render: ({
    isOpen,
    padding,
    overlay,
    smallBorderRadius,
    narrowWidth,
    autoHeight,
    gap,
  }) => (
    <Modal
      isOpen={isOpen}
      padding={padding}
      overlay={overlay}
      smallBorderRadius={smallBorderRadius}
      narrowWidth={narrowWidth}
      autoHeight={autoHeight}
      gap={gap}
    >
      <StyledCenteredTitle>
        <H1Title title="Hapus rekam?" fontColor={H1TitleFontColor.Primary} />
      </StyledCenteredTitle>
      <StyledSectionContainer>
        <Section
          alignment={SectionAlignment.Center}
          fontColor={SectionFontColor.Primary}
        >
          Tindakan ini tidak dapat dibatalkan. Rekaman dan semua datanya akan
          dihapus secara permanen.
        </Section>
      </StyledSectionContainer>
      <Button title="Batal" variant="secondary" fullWidth justify="center" />
      <Button
        title="Hapus"
        variant="secondary"
        accent="danger"
        fullWidth
        justify="center"
      />
    </Modal>
  ),
};

export const Small: Story = {
  args: {
    isOpen: true,
    size: 'small',
    padding: 'none',
    overlay: 'dark',
  },
  render: ({ isOpen, size, padding, overlay }) => (
    <Modal isOpen={isOpen} size={size} padding={padding} overlay={overlay}>
      <ModalHeader>
        <H2Title title="Arsipkan item" />
      </ModalHeader>
      <ModalContent>
        <Section>Apakah Anda yakin ingin mengarsipkan item ini?</Section>
      </ModalContent>
      <ModalFooter>
        <Button title="Tidak" variant="secondary" />
        <Button title="Ya, arsipkan" variant="primary" accent="blue" />
      </ModalFooter>
    </Modal>
  ),
};

export const ExtraLarge: Story = {
  args: {
    isOpen: true,
    size: 'extraLarge',
    padding: 'none',
    overlay: 'dark',
  },
  render: ({ isOpen, size, padding, overlay }) => (
    <Modal isOpen={isOpen} size={size} padding={padding} overlay={overlay}>
      <ModalHeader>
        <H2Title
          title="Impor kontak"
          description="Unggah file CSV untuk mengimpor kontak Anda"
        />
      </ModalHeader>
      <ModalContent>
        <Section>
          File harus memiliki kolom untuk nama, email, telepon, dan perusahaan.
          Seret dan letakkan file CSV di sini, atau klik untuk memilih.
        </Section>
      </ModalContent>
      <ModalFooter>
        <Button title="Batal" variant="secondary" />
        <Button title="Unggah & impor" variant="primary" accent="blue" />
      </ModalFooter>
    </Modal>
  ),
};

export const Closed: Story = {
  args: {
    isOpen: false,
    size: 'medium',
    padding: 'medium',
    overlay: 'dark',
  },
  render: ({ isOpen, size, padding, overlay }) => (
    <Modal isOpen={isOpen} size={size} padding={padding} overlay={overlay}>
      <ModalContent>Ini tidak akan terlihat.</ModalContent>
    </Modal>
  ),
};

const InteractiveModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        title="Buka Modal"
        variant="primary"
        accent="blue"
        onClick={() => setIsOpen(true)}
      />
      <Modal
        isOpen={isOpen}
        size="medium"
        padding="none"
        overlay="dark"
        onBackdropMouseDown={() => setIsOpen(false)}
      >
        <ModalHeader>
          <H2Title title="Buat rekam" />
          <IconButton
            Icon={IconX}
            variant="tertiary"
            size="small"
            onClick={() => setIsOpen(false)}
          />
        </ModalHeader>
        <ModalContent>
          <Section>
            Isi detail di bawah untuk membuat rekam baru. Semua kolom opsional.
          </Section>
        </ModalContent>
        <ModalFooter>
          <Button
            title="Batal"
            variant="secondary"
            onClick={() => setIsOpen(false)}
          />
          <Button
            title="Buat"
            variant="primary"
            accent="blue"
            onClick={() => setIsOpen(false)}
          />
        </ModalFooter>
      </Modal>
    </>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveModal />,
};
