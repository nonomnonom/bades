import { BaseEmail } from 'src/components/BaseEmail';
import { CallToAction } from 'src/components/CallToAction';
import { MainText } from 'src/components/MainText';
import { Title } from 'src/components/Title';

type SendEmailVerificationLinkEmailProps = {
  link: string;
  isEmailUpdate?: boolean;
  locale?: string;
};

export const SendEmailVerificationLinkEmail = ({
  link,
  isEmailUpdate = false,
}: SendEmailVerificationLinkEmailProps) => {
  const title = isEmailUpdate
    ? 'Konfirmasi alamat email baru'
    : 'Konfirmasi alamat email';
  const bodyText = isEmailUpdate
    ? 'Kami menerima permintaan untuk mengubah alamat email yang terkait dengan akun Bades Anda. Klik tombol di bawah untuk mengonfirmasi perubahan ini.'
    : 'Selamat datang di Bades. Sebelum mulai, kami perlu memastikan bahwa ini benar Anda. Klik tombol di bawah untuk memverifikasi alamat email Anda.';
  const ctaLabel = isEmailUpdate ? 'Konfirmasi email baru' : 'Verifikasi email';

  return (
    <BaseEmail width={333}>
      <Title value={title} />
      <MainText>
        Halo,
        <br />
        <br />
        {bodyText}
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

SendEmailVerificationLinkEmail.PreviewProps = {
  link: 'https://app.bades.id/verify-email/123',
  isEmailUpdate: false,
};

export default SendEmailVerificationLinkEmail;
