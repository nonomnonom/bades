import { BaseEmail } from 'src/components/BaseEmail';
import { CallToAction } from 'src/components/CallToAction';
import { MainText } from 'src/components/MainText';
import { Title } from 'src/components/Title';

type PasswordUpdateNotifyEmailProps = {
  userName: string;
  email: string;
  link: string;
  locale?: string;
};

export const PasswordUpdateNotifyEmail = ({
  userName,
  email,
  link,
}: PasswordUpdateNotifyEmailProps) => {
  const formattedDate = new Date().toLocaleDateString('id-ID', {
    dateStyle: 'long',
  });

  return (
    <BaseEmail>
      <Title value="Kata sandi diperbarui" />
      <MainText>
        {userName?.length > 1 ? `Halo ${userName},` : 'Halo,'}
        <br />
        <br />
        Ini adalah konfirmasi bahwa kata sandi akun Anda ({email}) berhasil
        diubah pada {formattedDate}.
        <br />
        <br />
        Jika Anda tidak melakukan perubahan ini, segera hubungi pemilik ruang
        kerja Anda.
        <br />
      </MainText>
      <br />
      <CallToAction value="Hubungi Bades" href={link} />
      <br />
      <br />
    </BaseEmail>
  );
};

PasswordUpdateNotifyEmail.PreviewProps = {
  userName: 'Budi Santoso',
  email: 'budi.santoso@desa-suka-maju.id',
  link: 'https://app.bades.id',
} as PasswordUpdateNotifyEmailProps;

export default PasswordUpdateNotifyEmail;
