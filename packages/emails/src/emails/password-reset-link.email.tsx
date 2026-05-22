import { Trans } from '@lingui/react';
import { BaseEmail } from 'src/components/BaseEmail';
import { CallToAction } from 'src/components/CallToAction';
import { Link } from 'src/components/Link';
import { MainText } from 'src/components/MainText';
import { Title } from 'src/components/Title';
import { createI18nInstance } from 'src/utils/i18n.utils';
import { type APP_LOCALES } from 'shared/translations';

type PasswordResetLinkEmailProps = {
  duration: string;
  hasPassword: boolean;
  link: string;
  locale: keyof typeof APP_LOCALES;
};

export const PasswordResetLinkEmail = ({
  duration,
  hasPassword,
  link,
  locale,
}: PasswordResetLinkEmailProps) => {
  const i18n = createI18nInstance(locale);
  const headline = hasPassword
    ? i18n._('Atur ulang kata sandi')
    : i18n._('Buat kata sandi');
  const ctaLabel = hasPassword ? i18n._('Atur ulang') : i18n._('Buat');

  return (
    <BaseEmail locale={locale}>
      <Title value={headline} />
      <MainText>
        <Trans
          id="Tautan ini hanya berlaku selama {duration} ke depan. Jika tautan tidak berfungsi, gunakan tautan verifikasi login berikut secara langsung:"
          values={{ duration }}
        />
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
  locale: 'id-ID',
} as PasswordResetLinkEmailProps;

export default PasswordResetLinkEmail;
