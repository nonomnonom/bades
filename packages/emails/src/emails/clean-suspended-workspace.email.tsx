import { Trans } from '@lingui/react';
import { BaseEmail } from 'src/components/BaseEmail';
import { CallToAction } from 'src/components/CallToAction';
import { MainText } from 'src/components/MainText';
import { Title } from 'src/components/Title';
import { createI18nInstance } from 'src/utils/i18n.utils';
import { type APP_LOCALES } from 'shared/translations';

type CleanSuspendedWorkspaceEmailProps = {
  daysSinceInactive: number;
  userName: string;
  workspaceDisplayName: string | undefined;
  locale: keyof typeof APP_LOCALES;
};

export const CleanSuspendedWorkspaceEmail = ({
  daysSinceInactive,
  userName,
  workspaceDisplayName,
  locale,
}: CleanSuspendedWorkspaceEmailProps) => {
  const i18n = createI18nInstance(locale);

  return (
    <BaseEmail width={333} locale={locale}>
      <Title value={i18n._('Ruang Kerja Dihapus')} />
      <MainText>
        {userName?.length > 1 ? (
          <Trans id="Halo {userName}," values={{ userName }} />
        ) : (
          <Trans id="Halo," />
        )}
        <br />
        <br />
        <Trans
          id="Ruang kerja <0>{workspaceDisplayName}</0> Anda telah dihapus karena langganan berakhir {daysSinceInactive} hari lalu."
          values={{ workspaceDisplayName, daysSinceInactive }}
          components={{ 0: <b /> }}
        />
        <br />
        <br />
        <Trans id="Semua data dalam ruang kerja tersebut telah dihapus secara permanen." />
        <br />
        <br />
        <Trans id="Jika Anda ingin menggunakan Bades lagi, Anda dapat membuat ruang kerja baru." />
      </MainText>
      <br />
      <CallToAction
        href="https://app.bades.id/"
        value={i18n._('Buat ruang kerja baru')}
      />
      <br />
      <br />
    </BaseEmail>
  );
};

CleanSuspendedWorkspaceEmail.PreviewProps = {
  daysSinceInactive: 1,
  userName: 'Budi Santoso',
  workspaceDisplayName: 'Desa Contoh',
  locale: 'id-ID',
};

export default CleanSuspendedWorkspaceEmail;
