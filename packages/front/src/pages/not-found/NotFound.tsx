import { Trans, useLingui } from '~/utils/i18n/badesI18n';
import { lazy, Suspense } from 'react';

const BackgroundMockPage = lazy(() =>
  import('@/sign-in-background-mock/components/BackgroundMockPage').then(
    (module) => ({ default: module.BackgroundMockPage }),
  ),
);
import { AppPath } from 'shared/types';

import { RootStackingContextZIndices } from '@/ui/layout/constants/RootStackingContextZIndices';
import { PageTitle } from '@/ui/utilities/page-title/components/PageTitle';
import { styled } from '@linaria/react';
import { MainButton } from 'ui/input';
import { themeCssVariables } from 'ui/theme-constants';
import {
  AnimatedPlaceholder,
  AnimatedPlaceholderEmptyTextContainer,
  AnimatedPlaceholderErrorContainer,
  AnimatedPlaceholderErrorSubTitle,
  AnimatedPlaceholderErrorTitle,
} from 'ui/layout';
import { UndecoratedLink } from 'ui/navigation';

const StyledBackDrop = styled.div`
  align-items: center;
  backdrop-filter: ${themeCssVariables.blur.light};
  background: ${themeCssVariables.background.transparent.secondary};
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: ${RootStackingContextZIndices.NotFound};
`;

const StyledButtonContainer = styled.div`
  width: 200px;
`;

export const NotFound = () => {
  const { t } = useLingui();

  return (
    <>
      <PageTitle title={t`Halaman Tidak Ditemukan | Bades.id`} />
      <StyledBackDrop>
        <AnimatedPlaceholderErrorContainer>
          <AnimatedPlaceholder type="error404" />
          <AnimatedPlaceholderEmptyTextContainer>
            <AnimatedPlaceholderErrorTitle>
              <Trans>Jalan yang dilalui tidak ditemukan</Trans>
            </AnimatedPlaceholderErrorTitle>
            <AnimatedPlaceholderErrorSubTitle>
              <Trans>
                Halaman yang Anda cari tidak ada atau sudah dipindahkan. Mari kembali ke jalur yang benar
              </Trans>
            </AnimatedPlaceholderErrorSubTitle>
          </AnimatedPlaceholderEmptyTextContainer>
          <StyledButtonContainer>
            <UndecoratedLink to={AppPath.Index}>
              <MainButton title={t`Kembali ke Beranda`} fullWidth />
            </UndecoratedLink>
          </StyledButtonContainer>
        </AnimatedPlaceholderErrorContainer>
      </StyledBackDrop>
      <Suspense fallback={null}>
        <BackgroundMockPage />
      </Suspense>
    </>
  );
};
