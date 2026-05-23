import { BaseEmail } from 'src/components/BaseEmail';
import { CallToAction } from 'src/components/CallToAction';
import { Link } from 'src/components/Link';
import { MainText } from 'src/components/MainText';
import { Title } from 'src/components/Title';

type PasswordResetLinkEmailProps = {
  duration: string;
  hasPassword: boolean;
  link: string;
  locale?: string;
};

export const PasswordResetLinkEmail = ({
  duration,
  hasPassword,
  link,
}: PasswordResetLinkEmailProps) => {
  const headline = hasPassword ? 'Atur ulang kata sandi' : 'Buat kata sandi';
  const ctaLabel = hasPassword ? 'Atur ulang sandi' : 'Buat sandi';
  const intro = hasPassword
    ? 'Kami menerima permintaan untuk mengatur ulang kata sandi akun Bades Anda. Klik tombol di bawah untuk membuat kata sandi baru.'
    : 'Akun Bades Anda belum memiliki kata sandi. Klik tombol di bawah untuk membuat kata sandi baru.';

  return (
    <BaseEmail>
      <Title value={headline} />
      <MainText>
        Halo,
        <br />
        <br />
        {intro}
        <br />
        <br />
        Tautan ini hanya berlaku selama {duration} ke depan. Jika tombol tidak
        berfungsi, salin dan tempel tautan berikut ke peramban Anda:
        <br />
        <Link href={link} value={link} />
        <br />
        <br />
        Jika Anda tidak meminta perubahan ini, abaikan email ini.
        <br />
        <br />
        Salam,
        <br />
        Tim Bades
      </MainText>
      <br />
      <CallToAction href={link} value={ctaLabel} />
      <br />
      <br />
    </BaseEmail>
  );
};

PasswordResetLinkEmail.PreviewProps = {
  duration: '24 jam',
  hasPassword: true,
  link: 'https://app.bades.id/reset-password/123',
} as PasswordResetLinkEmailProps;

export default PasswordResetLinkEmail;
