import { styled } from '@linaria/react';
import { t } from '~/utils/i18n/badesI18n';
import {
  IconBuildingSkyscraper,
  IconDotsVertical,
  IconLayoutSidebarRight,
  IconPlus,
  TintedIconTile,
} from 'ui/display';
import { Button, LightIconButton } from 'ui/input';

import { BackgroundMockTable } from '@/sign-in-background-mock/components/BackgroundMockTable';
import { BackgroundMockViewBar } from '@/sign-in-background-mock/components/BackgroundMockViewBar';
import { PageBody } from '@/ui/layout/page/components/PageBody';
import { PageContainer } from '@/ui/layout/page/components/PageContainer';
import { PageHeader } from '@/ui/layout/page/components/PageHeader';

const StyledTableContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  width: 100%;
`;

export const BackgroundMockPage = () => {
  return (
    <PageContainer>
      <PageHeader
        title={t`Data Desa`}
        Icon={() => (
          <TintedIconTile Icon={IconBuildingSkyscraper} color="blue" />
        )}
      >
        <Button
          Icon={IconPlus}
          title={t`Tambah Data`}
          variant="primary"
          accent="default"
          size="small"
        />
        <LightIconButton
          Icon={IconDotsVertical}
          accent="tertiary"
          size="small"
        />
        <Button
          Icon={IconLayoutSidebarRight}
          variant="secondary"
          accent="default"
          size="small"
        />
      </PageHeader>
      <PageBody>
        <StyledTableContainer>
          <BackgroundMockViewBar />
          <BackgroundMockTable />
        </StyledTableContainer>
      </PageBody>
    </PageContainer>
  );
};
