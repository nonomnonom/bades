import { Trans } from '@lingui/react';
import { BaseEmail } from 'src/components/BaseEmail';
import { CallToAction } from 'src/components/CallToAction';
import { MainText } from 'src/components/MainText';
import { Title } from 'src/components/Title';
import { createI18nInstance } from 'src/utils/i18n.utils';
import { type APP_LOCALES } from 'shared/translations';

type PasswordUpdateNotifyEmailProps = {
  userName: string;
  email: string;
  link: string;
  locale: keyof typeof APP_LOCALES;
};

export const PasswordUpdateNotifyEmail = ({
  userName,
  email,
  link,
  locale,
}: PasswordUpdateNotifyEmailProps) => {
  const i18n = createI18nInstance(locale);
  const formattedDate = i18n.date(new Date());

  return (
    <BaseEmail locale={locale}>
      <Title value={i18n._('Kata sandi diperbarui')} />
      <MainText>
        {userName?.length > 1 ? (
          <Trans id="Halo {userName}," values={{ userName }} />
        ) : (
          <Trans id="Halo," />
        )}
        <br />
        <br />
        <Trans
          id="Ini adalah konfirmasi bahwa kata sandi akun Anda ({email}) berhasil diubah pada {formattedDate}."
          values={{ email, formattedDate }}
        />
        <br />
        <br />
        <Trans id="Jika Anda tidak melakukan perubahan ini, segera hubungi pemilik workspace Anda." />
        <br />
      </MainText>
      <br />
      <CallToAction value={i18n._('Hubungi Bades')} href={link} />
      <br />
      <br />
    </BaseEmail>
  );
};

PasswordUpdateNotifyEmail.PreviewProps = {
  userName: 'Budi Santoso',
  email: 'budi.santoso@desa-suka-maju.id',
  link: 'https://app.bades.id',
  locale: 'id-ID',
} as PasswordUpdateNotifyEmailProps;

export default PasswordUpdateNotifyEmail;
