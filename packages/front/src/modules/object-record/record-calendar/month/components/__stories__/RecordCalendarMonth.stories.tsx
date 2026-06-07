import { type Meta, type StoryObj } from '@storybook/react-vite';
import { useEffect, useMemo, useState } from 'react';

import { type TaskGroups } from '@/activities/tasks/components/TaskGroups';
import { contextStoreCurrentViewIdComponentState } from '@/context-store/states/contextStoreCurrentViewIdComponentState';
import { CoreObjectNamePlural } from '@/object-metadata/types/CoreObjectNamePlural';
import { ObjectFilterDropdownComponentInstanceContext } from '@/object-record/object-filter-dropdown/states/contexts/ObjectFilterDropdownComponentInstanceContext';
import { RecordIndexContextProvider } from '@/object-record/record-index/contexts/RecordIndexContext';
import { RecordTableComponentInstanceContext } from '@/object-record/record-table/states/context/RecordTableComponentInstanceContext';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { ViewComponentInstanceContext } from '@/views/states/contexts/ViewComponentInstanceContext';
import { CoreObjectNameSingular } from 'shared/types';

import { MAIN_CONTEXT_STORE_INSTANCE_ID } from '@/context-store/constants/MainContextStoreInstanceId';
import { RecordComponentInstanceContextsWrapper } from '@/object-record/components/RecordComponentInstanceContextsWrapper';
import { RecordCalendarContextProvider } from '@/object-record/record-calendar/contexts/RecordCalendarContext';
import { RecordCalendarMonth } from '@/object-record/record-calendar/month/components/RecordCalendarMonth';
import { currentRecordFieldsComponentState } from '@/object-record/record-field/states/currentRecordFieldsComponentState';
import { type RecordField } from '@/object-record/record-field/types/RecordField';
import { useRecordIndexFieldMetadataDerivedStates } from '@/object-record/record-index/hooks/useRecordIndexFieldMetadataDerivedStates';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';
import { ViewBarFilterDropdownIds } from '@/views/constants/ViewBarFilterDropdownIds';
import { ComponentDecorator, RouterDecorator } from 'ui/testing';
import { ContextStoreDecorator } from '~/testing/decorators/ContextStoreDecorator';
import { IconsProviderDecorator } from '~/testing/decorators/IconsProviderDecorator';
import { ObjectMetadataItemsDecorator } from '~/testing/decorators/ObjectMetadataItemsDecorator';
import { SnackBarDecorator } from '~/testing/decorators/SnackBarDecorator';
import { mockedViews } from '~/testing/mock-data/generated/metadata/views/mock-views-data';
import { getTestEnrichedObjectMetadataItemsMock } from '~/testing/utils/getTestEnrichedObjectMetadataItemsMock';
import { setTestViewsInMetadataStore } from '~/testing/utils/setTestViewsInMetadataStore';

const meta: Meta<typeof RecordCalendarMonth> = {
  title: 'Modules/ObjectRecord/RecordCalendar/Month',
  component: RecordCalendarMonth,
  decorators: [
    (Story) => {
      const keluargaObjectMetadataItem =
        getTestEnrichedObjectMetadataItemsMock().find(
          (item) => item.nameSingular === 'keluarga',
        )!;
      const instanceId = keluargaObjectMetadataItem.id;

      const setCurrentRecordFields = useSetAtomComponentState(
        currentRecordFieldsComponentState,
        instanceId,
      );

      const mockView = mockedViews.find((v) => v.name === 'Semua Keluarga')!;

      const setContextStoreCurrentViewId = useSetAtomComponentState(
        contextStoreCurrentViewIdComponentState,
        MAIN_CONTEXT_STORE_INSTANCE_ID,
      );

      const columns = useMemo(
        () =>
          keluargaObjectMetadataItem.fields.map(
            (fieldMetadataItem, index) =>
              ({
                id: fieldMetadataItem.id,
                fieldMetadataItemId: fieldMetadataItem.id,
                isVisible: true,
                position: index,
                size: 100,
              }) satisfies RecordField,
          ),
        [keluargaObjectMetadataItem.fields],
      );

      const [isLoaded, setIsLoaded] = useState(false);

      useEffect(() => {
        setTestViewsInMetadataStore(jotaiStore, [mockView]);
        setContextStoreCurrentViewId(mockView.id);
        setCurrentRecordFields(columns);
        setIsLoaded(true);
      }, [
        setContextStoreCurrentViewId,
        setCurrentRecordFields,
        mockView,
        columns,
      ]);

      const {
        fieldDefinitionByFieldMetadataItemId,
        fieldMetadataItemByFieldMetadataItemId,
        labelIdentifierFieldMetadataItem,
        recordFieldByFieldMetadataItemId,
      } = useRecordIndexFieldMetadataDerivedStates(
        keluargaObjectMetadataItem,
        instanceId,
      );

      if (!isLoaded) {
        return <></>;
      }

      return (
        <RecordIndexContextProvider
          value={{
            objectPermissionsByObjectMetadataId: {},
            indexIdentifierUrl: () => '',
            onIndexRecordsLoaded: () => {},
            objectNamePlural: CoreObjectNamePlural.Keluarga,
            objectNameSingular: 'keluarga',
            objectMetadataItem: keluargaObjectMetadataItem,
            recordIndexId: instanceId,
            viewBarInstanceId: instanceId,
            labelIdentifierFieldMetadataItem,
            recordFieldByFieldMetadataItemId,
            fieldDefinitionByFieldMetadataItemId,
            fieldMetadataItemByFieldMetadataItemId,
          }}
        >
          <RecordComponentInstanceContextsWrapper
            componentInstanceId={instanceId}
          >
            <ObjectFilterDropdownComponentInstanceContext.Provider
              value={{ instanceId: ViewBarFilterDropdownIds.MAIN }}
            >
              <RecordTableComponentInstanceContext.Provider
                value={{
                  instanceId: instanceId,
                }}
              >
                <ViewComponentInstanceContext.Provider value={{ instanceId }}>
                  <RecordCalendarContextProvider
                    value={{
                      viewBarInstanceId: instanceId,
                      objectNameSingular: 'keluarga',
                      visibleRecordFields: [],
                      objectMetadataItem: keluargaObjectMetadataItem,
                      objectPermissions: {
                        objectMetadataId: keluargaObjectMetadataItem.id,
                        canReadObjectRecords: true,
                        canUpdateObjectRecords: true,
                        canSoftDeleteObjectRecords: true,
                        canDestroyObjectRecords: true,
                        restrictedFields: {},
                        rowLevelPermissionPredicates: [],
                        rowLevelPermissionPredicateGroups: [],
                      },
                    }}
                  >
                    <Story />
                  </RecordCalendarContextProvider>
                </ViewComponentInstanceContext.Provider>
              </RecordTableComponentInstanceContext.Provider>
            </ObjectFilterDropdownComponentInstanceContext.Provider>
          </RecordComponentInstanceContextsWrapper>
        </RecordIndexContextProvider>
      );
    },
    ContextStoreDecorator,
    ObjectMetadataItemsDecorator,
    SnackBarDecorator,
    ComponentDecorator,
    IconsProviderDecorator,
    RouterDecorator,
  ],
};

export default meta;
type Story = StoryObj<typeof TaskGroups>;

export const Default: Story = {
  play: async () => {},
};
