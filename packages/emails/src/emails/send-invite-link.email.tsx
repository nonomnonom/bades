import { Img } from '@react-email/components';
import { emailTheme } from 'src/common-style';

import { BaseEmail } from 'src/components/BaseEmail';
import { CallToAction } from 'src/components/CallToAction';
import { HighlightedContainer } from 'src/components/HighlightedContainer';
import { HighlightedText } from 'src/components/HighlightedText';
import { Link } from 'src/components/Link';
import { MainText } from 'src/components/MainText';
import { Title } from 'src/components/Title';
import { WhatIsBades } from 'src/components/WhatIsBades';
import { capitalize } from 'src/utils/capitalize';
import { getImageAbsoluteURI } from 'shared/utils';

type SendInviteLinkEmailProps = {
  link: string;
  workspace: { name: string | undefined; logo: string | undefined };
  sender: {
    email: string;
    firstName: string;
    lastName: string;
  };
  serverUrl: string;
  locale?: string;
};

export const SendInviteLinkEmail = ({
  link,
  workspace,
  sender,
  serverUrl,
}: SendInviteLinkEmailProps) => {
  const workspaceLogo = workspace.logo
    ? getImageAbsoluteURI({ imageUrl: workspace.logo, baseUrl: serverUrl })
    : null;

  const senderName = capitalize(sender.firstName);
  const senderEmail = sender.email;
  const workspaceName = workspace.name;

  return (
    <BaseEmail width={333}>
      <Title value="Bergabung dengan tim di Bades" />
      <MainText>
        {senderName} (
        <Link
          href={`mailto:${senderEmail}`}
          value={senderEmail}
          color={emailTheme.font.colors.blue}
        />
        ) mengundang Anda untuk bergabung ke ruang kerja{' '}
        <b>{workspaceName}</b>.
        <br />
      </MainText>
      <HighlightedContainer>
        {workspaceLogo ? (
          <Img
            src={workspaceLogo}
            width={40}
            height={40}
            alt="Logo ruang kerja"
          />
        ) : (
          <></>
        )}
        {workspace.name ? <HighlightedText value={workspace.name} /> : <></>}
        <CallToAction href={link} value="Terima undangan" />
      </HighlightedContainer>
      <WhatIsBades />
    </BaseEmail>
  );
};

SendInviteLinkEmail.PreviewProps = {
  link: 'https://app.bades.id/invite/123',
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
} as SendInviteLinkEmailProps;

export default SendInviteLinkEmail;
