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
  const ctaLabel = hasPassword ? 'Atur ulang' : 'Buat';

  return (
    <BaseEmail>
      <Title value={headline} />
      <MainText>
        Tautan ini hanya berlaku selama {duration} ke depan. Jika tautan tidak
        berfungsi, gunakan tautan verifikasi login berikut secara langsung:
        <br />
        <Link href={link} value={link} />
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
