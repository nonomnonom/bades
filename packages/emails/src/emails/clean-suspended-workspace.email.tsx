import { BaseEmail } from 'src/components/BaseEmail';
import { CallToAction } from 'src/components/CallToAction';
import { MainText } from 'src/components/MainText';
import { Title } from 'src/components/Title';

type CleanSuspendedWorkspaceEmailProps = {
  daysSinceInactive: number;
  userName: string;
  workspaceDisplayName: string | undefined;
  locale?: string;
};

export const CleanSuspendedWorkspaceEmail = ({
  daysSinceInactive,
  userName,
  workspaceDisplayName,
}: CleanSuspendedWorkspaceEmailProps) => {
  return (
    <BaseEmail width={333}>
      <Title value="Ruang kerja telah dihapus" />
      <MainText>
        {userName?.length > 1 ? `Halo ${userName},` : 'Halo,'}
        <br />
        <br />
        Ruang kerja <b>{workspaceDisplayName}</b> Anda telah dihapus karena
        langganan berakhir {daysSinceInactive} hari yang lalu.
        <br />
        <br />
        Seluruh data di dalam ruang kerja tersebut sudah dihapus secara
        permanen dan tidak dapat dipulihkan.
        <br />
        <br />
        Jika Anda ingin kembali menggunakan Bades, silakan buat ruang kerja
        baru melalui tombol di bawah.
        <br />
        <br />
        Salam,
        <br />
        Tim Bades
      </MainText>
      <br />
      <CallToAction href="https://app.bades.id/" value="Buat ruang kerja baru" />
      <br />
      <br />
    </BaseEmail>
  );
};

CleanSuspendedWorkspaceEmail.PreviewProps = {
  daysSinceInactive: 1,
  userName: 'Budi Santoso',
  workspaceDisplayName: 'Desa Contoh',
};

export default CleanSuspendedWorkspaceEmail;
