import { type Meta, type StoryObj } from '@storybook/react-vite';

import { CoreObjectNameSingular } from 'shared/types';
import { LayoutRenderingProvider } from '@/ui/layout/contexts/LayoutRenderingContext';
import { MemoryRouterDecorator } from '~/testing/decorators/MemoryRouterDecorator';
import { ObjectMetadataItemsDecorator } from '~/testing/decorators/ObjectMetadataItemsDecorator';
import { SnackBarDecorator } from '~/testing/decorators/SnackBarDecorator';
import { graphqlMocks } from '~/testing/graphqlMocks';
import { RecordDetailDuplicatesSection } from '@/object-record/record-field-list/record-detail-section/duplicate/components/RecordDetailDuplicatesSection';
import { ComponentDecorator } from 'ui/testing';
import { PageLayoutType } from '~/generated-metadata/graphql';
import { mockedKeluargaRecords } from '~/testing/mock-data/generated/data/keluarga/mock-keluarga-data';

const meta: Meta<typeof RecordDetailDuplicatesSection> = {
  title:
    'Modules/ObjectRecord/RecordShow/RecordDetailSection/RecordDetailDuplicatesSection',
  component: RecordDetailDuplicatesSection,
  decorators: [
    (Story) => (
      <LayoutRenderingProvider
        value={{
          targetRecordIdentifier: {
            id: mockedKeluargaRecords[0].id,
            targetObjectNameSingular: 'keluarga',
          },
          layoutType: PageLayoutType.RECORD_PAGE,
          isInSidePanel: false,
        }}
      >
        <Story />
      </LayoutRenderingProvider>
    ),
    ComponentDecorator,
    ObjectMetadataItemsDecorator,
    SnackBarDecorator,
    MemoryRouterDecorator,
  ],
  args: {
    objectRecordId: mockedKeluargaRecords[0].id,
    objectNameSingular: 'company',
  },
  parameters: {
    msw: graphqlMocks,
  },
};

export default meta;
type Story = StoryObj<typeof RecordDetailDuplicatesSection>;

export const Default: Story = {};
