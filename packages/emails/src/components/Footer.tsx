import { type I18n } from '@lingui/core';
import { Column, Container, Row } from '@react-email/components';
import { Link } from 'src/components/Link';
import { ShadowText } from 'src/components/ShadowText';

const footerContainerStyle = {
  marginTop: '12px',
};

type FooterProps = {
  i18n: I18n;
};

export const Footer = ({ i18n }: FooterProps) => {
  return (
    <Container style={footerContainerStyle}>
      <Row>
        <Column>
          <ShadowText>
            <Link
              href="https://bades.id/"
              value={i18n._('Situs web')}
              aria-label={i18n._('Kunjungi situs web Bades')}
            />
          </ShadowText>
        </Column>
        <Column>
          <ShadowText>
            <Link
              href="https://docs.bades.id/getting-started/introduction"
              value={i18n._('Panduan pengguna')}
              aria-label={i18n._('Baca panduan pengguna Bades')}
            />
          </ShadowText>
        </Column>
      </Row>
      <ShadowText>
        <>
          {i18n._('Bades.id, Sistem Informasi Desa')}
          <br />
          {i18n._('Indonesia')}
        </>
      </ShadowText>
    </Container>
  );
};