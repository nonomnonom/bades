import { type I18n } from '@lingui/core';
import { MainText } from 'src/components/MainText';
import { SubTitle } from 'src/components/SubTitle';

type WhatIsBadesProps = {
  i18n: I18n;
};

export const WhatIsBades = ({ i18n }: WhatIsBadesProps) => {
  return (
    <>
      <SubTitle value={i18n._('Apa itu Bades?')} />
      <MainText>
        {i18n._(
          'Bades adalah Sistem Informasi Desa (SID) yang membantu mengelola data dan administrasi pemerintahan desa secara efisien.',
        )}
      </MainText>
    </>
  );
};