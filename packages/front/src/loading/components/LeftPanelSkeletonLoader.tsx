import { styled } from '@linaria/react';
import { m } from 'framer-motion';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { SKELETON_LOADER_HEIGHT_SIZES } from '@/activities/const/skeleton-loader-height-sizes.const';
import { NAVIGATION_DRAWER_CONSTRAINTS } from '@/ui/layout/resizable-panel/constants/NavigationDrawerConstraints';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { MainNavigationDrawerItemsSkeletonLoader } from '~/loading/components/MainNavigationDrawerItemsSkeletonLoader';
import { useContext } from 'react';
import { ThemeContext } from 'ui/theme-constants';

const StyledAnimatedContainer = styled(m.div)`
  align-items: center;
  display: flex;
  justify-content: end;
`;

const StyledItemsContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 14px;
  height: calc(100dvh - 32px);
  margin-bottom: auto;
  max-width: 204px;
  min-width: 204px;
  overflow-y: auto;
`;

const StyledSkeletonContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const StyledSkeletonTitleContainer = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 32px;
  justify-content: center;

  max-width: 196px;
  min-width: 196px;
`;

export const LeftPanelSkeletonLoader = () => {
  const { theme } = useContext(ThemeContext);
  const isMobile = useIsMobile();
  return (
    <StyledAnimatedContainer
      initial={false}
      animate={{
        scaleX: isMobile ? 0 : 1,
        opacity: isMobile ? 0 : 1,
      }}
      style={{
        width: isMobile ? 0 : NAVIGATION_DRAWER_CONSTRAINTS.default,
        transformOrigin: 'left',
      }}
      transition={{
        duration: theme.animation.duration.fast,
      }}
    >
      <StyledItemsContainer>
        <StyledSkeletonTitleContainer>
          <SkeletonTheme
            baseColor={theme.background.tertiary}
            highlightColor={theme.background.transparent.lighter}
            borderRadius={4}
          >
            <Skeleton
              width={96}
              height={SKELETON_LOADER_HEIGHT_SIZES.standard.s}
            />
          </SkeletonTheme>
        </StyledSkeletonTitleContainer>
        <StyledSkeletonContainer>
          <MainNavigationDrawerItemsSkeletonLoader length={3} />
          <MainNavigationDrawerItemsSkeletonLoader title length={2} />
          <MainNavigationDrawerItemsSkeletonLoader title length={3} />
        </StyledSkeletonContainer>
      </StyledItemsContainer>
    </StyledAnimatedContainer>
  );
};
