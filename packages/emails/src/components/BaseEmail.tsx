import { Container, Html } from '@react-email/components';

import { BaseHead } from 'src/components/BaseHead';
import { Footer } from 'src/components/Footer';
import { Logo } from 'src/components/Logo';

type BaseEmailProps = {
  children: JSX.Element | JSX.Element[] | string;
  width?: number;
  locale?: string;
};

export const BaseEmail = ({ children, width, locale }: BaseEmailProps) => {
  return (
    <Html lang={locale ?? 'id'}>
      <BaseHead />
      <Container width={width || 290}>
        <Logo />
        {children}
        <Footer />
      </Container>
    </Html>
  );
};
