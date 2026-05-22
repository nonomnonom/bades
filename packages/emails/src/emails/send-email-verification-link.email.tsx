import { Trans } from '@lingui/react';
import { BaseEmail } from 'src/components/BaseEmail';
import { CallToAction } from 'src/components/CallToAction';
import { MainText } from 'src/components/MainText';
import { Title } from 'src/components/Title';
import { createI18nInstance } from 'src/utils/i18n.utils';
import { type APP_LOCALES } from 'shared/translations';

type SendEmailVerificationLinkEmailProps = {
  link: string;
  locale: keyof typeof APP_LOCALES;
  isEmailUpdate?: boolean;
};

export const SendEmailVerificationLinkEmail = ({
  link,
  locale,
  isEmailUpdate = false,
}: SendEmailVerificationLinkEmailProps) => {
  const i18n = createI18nInstance(locale);
  const title = isEmailUpdate
    ? i18n._('Konfirmasi alamat email baru')
    : i18n._('Konfirmasi alamat email');
  const bodyId = isEmailUpdate
    ? 'Kami menerima permintaan untuk mengubah alamat email yang terkait dengan akun Bades Anda. Klik di bawah untuk mengonfirmasi perubahan ini.'
    : 'Terima kasih telah mendaftar untuk akun Bades! Sebelum kami mulai, kami perlu memastikan bahwa ini adalah Anda. Klik di bawah untuk memverifikasi alamat email Anda.';
  const ctaLabel = isEmailUpdate
    ? i18n._('Konfirmasi email baru')
    : i18n._('Verifikasi email');

  return (
    <BaseEmail width={333} locale={locale}>
      <Title value={title} />
      <MainText>
        <Trans id={bodyId} />
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
  locale: 'id-ID',
  isEmailUpdate: false,
};

export default SendEmailVerificationLinkEmail;
