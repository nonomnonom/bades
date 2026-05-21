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
              value={i18n._('Website')}
              aria-label={i18n._("Visit Bades's website")}
            />
          </ShadowText>
        </Column>
        <Column>
          <ShadowText>
            <Link
              href="https://github.com/badesid/bades"
              value={i18n._('Github')}
              aria-label={i18n._("Visit Bades's GitHub repository")}
            />
          </ShadowText>
        </Column>
        <Column>
          <ShadowText>
            <Link
              href="https://docs.bades.id/getting-started/introduction"
              value={i18n._('User guide')}
              aria-label={i18n._("Read Bades's user guide")}
            />
          </ShadowText>
        </Column>
        <Column>
          <ShadowText>
            <Link
              href="https://docs.bades.id/"
              value={i18n._('Developers')}
              aria-label={i18n._("Visit Bades's developer documentation")}
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