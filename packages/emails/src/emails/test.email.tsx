import { BaseEmail } from 'src/components/BaseEmail';
import { Title } from 'src/components/Title';

// Email uji yang tidak digunakan di produksi.
// Berguna untuk pengujian dan eksplorasi di lingkungan lokal.
export const TestEmail = () => {
  return (
    <BaseEmail>
      <Title value="Email uji coba" />
      <br />
      <br />
    </BaseEmail>
  );
};

TestEmail.PreviewProps = {};

export default TestEmail;
