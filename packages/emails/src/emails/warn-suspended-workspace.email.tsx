import { BaseEmail } from 'src/components/BaseEmail';
import { CallToAction } from 'src/components/CallToAction';
import { MainText } from 'src/components/MainText';
import { Title } from 'src/components/Title';

type WarnSuspendedWorkspaceEmailProps = {
  daysSinceInactive: number;
  inactiveDaysBeforeDelete: number;
  userName: string;
  workspaceDisplayName: string | undefined;
  locale?: string;
};

export const WarnSuspendedWorkspaceEmail = ({
  daysSinceInactive,
  inactiveDaysBeforeDelete,
  userName,
  workspaceDisplayName,
}: WarnSuspendedWorkspaceEmailProps) => {
  const daysLeft = inactiveDaysBeforeDelete - daysSinceInactive;
  const remainingDays = daysLeft > 0 ? daysLeft : 0;

  return (
    <BaseEmail width={333}>
      <Title value="Ruang kerja ditangguhkan" />
      <MainText>
        {userName?.length > 1 ? `Halo ${userName},` : 'Halo,'}
        <br />
        <br />
        Ruang kerja <b>{workspaceDisplayName}</b> Anda telah ditangguhkan
        selama {daysSinceInactive} hari.
        <br />
        <br />
        Jika langganan tidak diperbarui dalam {remainingDays} hari ke depan,
        ruang kerja akan dinonaktifkan dan seluruh datanya akan dihapus
        secara permanen.
        <br />
        <br />
        Untuk tetap menggunakan Bades, silakan perbarui langganan melalui
        tombol di bawah.
        <br />
        <br />
        Salam,
        <br />
        Tim Bades
      </MainText>
      <br />
      <CallToAction
        href="https://app.bades.id/settings/billing"
        value="Perbarui langganan"
      />
      <br />
      <br />
    </BaseEmail>
  );
};

WarnSuspendedWorkspaceEmail.PreviewProps = {
  daysSinceInactive: 10,
  inactiveDaysBeforeDelete: 14,
  userName: 'Budi Santoso',
  workspaceDisplayName: 'Desa Contoh',
};

export default WarnSuspendedWorkspaceEmail;
