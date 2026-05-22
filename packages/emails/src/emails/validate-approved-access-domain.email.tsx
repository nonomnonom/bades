import { Img } from '@react-email/components';
import { emailTheme } from 'src/common-style';

import { BaseEmail } from 'src/components/BaseEmail';
import { CallToAction } from 'src/components/CallToAction';
import { HighlightedContainer } from 'src/components/HighlightedContainer';
import { HighlightedText } from 'src/components/HighlightedText';
import { Link } from 'src/components/Link';
import { MainText } from 'src/components/MainText';
import { Title } from 'src/components/Title';
import { DEFAULT_WORKSPACE_LOGO } from 'src/constants/DefaultWorkspaceLogo';
import { capitalize } from 'src/utils/capitalize';
import { getImageAbsoluteURI } from 'shared/utils';

type SendApprovedAccessDomainValidationProps = {
  link: string;
  domain: string;
  workspace: { name: string | undefined; logo: string | undefined };
  sender: {
    email: string;
    firstName: string;
    lastName: string;
  };
  serverUrl: string;
  locale?: string;
};

export const SendApprovedAccessDomainValidation = ({
  link,
  domain,
  workspace,
  sender,
  serverUrl,
}: SendApprovedAccessDomainValidationProps) => {
  const workspaceLogo = workspace.logo
    ? getImageAbsoluteURI({ imageUrl: workspace.logo, baseUrl: serverUrl })
    : null;

  const senderName = capitalize(sender.firstName);
  const senderEmail = sender.email;

  return (
    <BaseEmail width={333}>
      <Title value="Validasi domain" />
      <MainText>
        {senderName} (
        <Link
          href={`mailto:${senderEmail}`}
          value={senderEmail}
          color={emailTheme.font.colors.blue}
        />
        ): Silakan validasi domain ini agar pengguna dengan alamat email{' '}
        <b>@{domain}</b> dapat bergabung ke ruang kerja Anda tanpa perlu
        undangan.
        <br />
      </MainText>
      <HighlightedContainer>
        <Img
          src={workspaceLogo ?? DEFAULT_WORKSPACE_LOGO}
          width={40}
          height={40}
          alt={workspace.name ?? 'Logo ruang kerja'}
        />
        {workspace.name ? <HighlightedText value={workspace.name} /> : <></>}
        <CallToAction href={link} value="Validasi domain" />
      </HighlightedContainer>
      <br />
    </BaseEmail>
  );
};

SendApprovedAccessDomainValidation.PreviewProps = {
  link: 'https://app.bades.id/validate-domain',
  domain: 'example.com',
  workspace: {
    name: 'Desa Contoh',
    logo: 'https://fakeimg.pl/200x200/?text=DESA&font=lobster',
  },
  sender: {
    email: 'budi.santoso@desa-suka-maju.id',
    firstName: 'Budi',
    lastName: 'Santoso',
  },
  serverUrl: 'https://app.bades.id',
};

export default SendApprovedAccessDomainValidation;
