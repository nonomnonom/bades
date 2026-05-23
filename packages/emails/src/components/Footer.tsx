import { Column, Container, Row } from '@react-email/components';
import { Link } from 'src/components/Link';
import { ShadowText } from 'src/components/ShadowText';

const footerContainerStyle = {
  marginTop: '12px',
};

export const Footer = () => {
  return (
    <Container style={footerContainerStyle}>
      <Row>
        <Column>
          <ShadowText>
            <Link
              href="https://bades.id/"
              value="Situs web"
              aria-label="Kunjungi situs web Bades"
            />
          </ShadowText>
        </Column>
        <Column>
          <ShadowText>
            <Link
              href="https://docs.bades.id/getting-started/introduction"
              value="Panduan pengguna"
              aria-label="Baca panduan pengguna Bades"
            />
          </ShadowText>
        </Column>
      </Row>
      <ShadowText>
        <>
          Bades.id, Sistem Informasi Desa
          <br />
          Indonesia
        </>
      </ShadowText>
    </Container>
  );
};
