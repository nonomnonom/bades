import { useMemo } from 'react';
import { ActivityTargetsInlineCell } from '@/activities/inline-cell/components/ActivityTargetsInlineCell';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { formatFieldMetadataItemAsColumnDefinition } from '@/object-metadata/utils/formatFieldMetadataItemAsColumnDefinition';
import { useObjectPermissions } from '@/object-record/hooks/useObjectPermissions';
import { useIsRecordReadOnly } from '@/object-record/read-only/hooks/useIsRecordReadOnly';
import { isRecordFieldReadOnly } from '@/object-record/read-only/utils/isRecordFieldReadOnly';
import { RecordFieldListCellEditModePortal } from '@/object-record/record-field-list/anchored-portal/components/RecordFieldListCellEditModePortal';
import { RecordFieldListCellHoveredPortal } from '@/object-record/record-field-list/anchored-portal/components/RecordFieldListCellHoveredPortal';
import { useFieldListFieldMetadataItems } from '@/object-record/record-field-list/hooks/useFieldListFieldMetadataItems';
import { RecordDetailDuplicatesSection } from '@/object-record/record-field-list/record-detail-section/duplicate/components/RecordDetailDuplicatesSection';
import { RecordDetailMorphRelationSection } from '@/object-record/record-field-list/record-detail-section/relation/components/RecordDetailMorphRelationSection';
import { RecordDetailRelationSection } from '@/object-record/record-field-list/record-detail-section/relation/components/RecordDetailRelationSection';
import { RecordFieldListComponentInstanceContext } from '@/object-record/record-field-list/states/contexts/RecordFieldListComponentInstanceContext';
import { recordFieldListHoverPositionComponentState } from '@/object-record/record-field-list/states/recordFieldListHoverPositionComponentState';
import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
import { RecordFieldComponentInstanceContext } from '@/object-record/record-field/ui/states/contexts/RecordFieldComponentInstanceContext';
import { isJunctionRelationForbidden } from '@/object-record/record-field/ui/utils/junction/isJunctionRelationForbidden';
import { RecordInlineCell } from '@/object-record/record-inline-cell/components/RecordInlineCell';
import { PropertyBox } from '@/object-record/record-inline-cell/property-box/components/PropertyBox';
import { useRecordShowContainerActions } from '@/object-record/record-show/hooks/useRecordShowContainerActions';
import { useRecordShowContainerData } from '@/object-record/record-show/hooks/useRecordShowContainerData';
import { getRecordFieldInputInstanceId } from '@/object-record/utils/getRecordFieldInputId';
import { getObjectPermissionsFromMapByObjectMetadataId } from '@/settings/roles/role-permissions/objects-permissions/utils/getObjectPermissionsFromMapByObjectMetadataId';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { FieldMetadataType, type CoreObjectNameSingular } from 'shared/types';

type RecordFieldListProps = {
  instanceId: string;
  objectNameSingular: string;
  objectRecordId: string;
  showDuplicatesSection?: boolean;
  showRelationSections?: boolean;
  excludeFieldMetadataIds?: string[];
  excludeCreatedAtAndUpdatedAt?: boolean;
};

const LegacyActivityTargetFieldItem = ({
  fieldMetadataItem,
  index,
  objectRecordId,
  objectMetadataItem,
  useUpdateOneObjectRecordMutation,
  isRecordReadOnly,
  objectPermissionsByObjectMetadataId,
  handleMouseEnter,
  instanceId,
  objectNameSingular,
}: {
  fieldMetadataItem: any;
  index: number;
  objectRecordId: string;
  objectMetadataItem: any;
  useUpdateOneObjectRecordMutation: any;
  isRecordReadOnly: boolean;
  objectPermissionsByObjectMetadataId: any;
  handleMouseEnter: (index: number) => void;
  instanceId: string;
  objectNameSingular: string;
}) => {
  const fieldDefinition = useMemo(
    () =>
      formatFieldMetadataItemAsColumnDefinition({
        field: fieldMetadataItem,
        position: index,
        objectMetadataItem,
        showLabel: true,
        labelWidth: 90,
      }),
    [fieldMetadataItem, index, objectMetadataItem],
  );

  const fieldContextValue = useMemo(
    () => ({
      recordId: objectRecordId,
      maxWidth: 200,
      isLabelIdentifier: false,
      fieldDefinition,
      useUpdateRecord: useUpdateOneObjectRecordMutation,
      isDisplayModeFixHeight: true,
      onMouseEnter: () => handleMouseEnter(index),
      anchorId: `${getRecordFieldInputInstanceId({
        recordId: objectRecordId,
        fieldName: fieldMetadataItem.name,
        prefix: instanceId,
      })}`,
      isRecordFieldReadOnly: isRecordFieldReadOnly({
        isRecordReadOnly,
        isSystemObject: objectMetadataItem.isSystem,
        objectPermissions: getObjectPermissionsFromMapByObjectMetadataId({
          objectPermissionsByObjectMetadataId,
          objectMetadataId: objectMetadataItem.id,
        }),
        fieldMetadataItem: {
          id: fieldMetadataItem.id,
          isUIReadOnly: fieldMetadataItem.isUIReadOnly ?? false,
          isCustom: fieldMetadataItem.isCustom ?? false,
        },
        fieldDefinition,
        objectPermissionsByObjectMetadataId,
      }),
    }),
    [
      objectRecordId,
      fieldDefinition,
      fieldMetadataItem,
      handleMouseEnter,
      index,
      instanceId,
      isRecordReadOnly,
      objectMetadataItem,
      objectPermissionsByObjectMetadataId,
      useUpdateOneObjectRecordMutation,
    ],
  );

  return (
    <FieldContext.Provider
      key={objectRecordId + fieldMetadataItem.id}
      value={fieldContextValue}
    >
      <ActivityTargetsInlineCell
        componentInstanceId={getRecordFieldInputInstanceId({
          recordId: objectRecordId,
          fieldName: fieldMetadataItem.name,
          prefix: instanceId,
        })}
        activityObjectNameSingular={
          objectNameSingular as
            | CoreObjectNameSingular.Note
            | CoreObjectNameSingular.Task
        }
        activityRecordId={objectRecordId}
        showLabel={true}
        maxWidth={200}
      />
    </FieldContext.Provider>
  );
};

const InlineFieldItem = ({
  fieldMetadataItem,
  index,
  objectRecordId,
  objectMetadataItem,
  useUpdateOneObjectRecordMutation,
  isRecordReadOnly,
  objectPermissionsByObjectMetadataId,
  objectMetadataItems,
  handleMouseEnter,
  legacyActivityTargetCount,
  instanceId,
  loading,
}: {
  fieldMetadataItem: any;
  index: number;
  objectRecordId: string;
  objectMetadataItem: any;
  useUpdateOneObjectRecordMutation: any;
  isRecordReadOnly: boolean;
  objectPermissionsByObjectMetadataId: any;
  objectMetadataItems: any;
  handleMouseEnter: (index: number) => void;
  legacyActivityTargetCount: number;
  instanceId: string;
  loading: boolean;
}) => {
  const fieldDefinition = useMemo(
    () =>
      formatFieldMetadataItemAsColumnDefinition({
        field: fieldMetadataItem,
        position: index,
        objectMetadataItem,
        showLabel: true,
        labelWidth: 90,
      }),
    [fieldMetadataItem, index, objectMetadataItem],
  );

  const fieldContextValue = useMemo(
    () => ({
      recordId: objectRecordId,
      maxWidth: 200,
      isLabelIdentifier: false,
      fieldDefinition,
      useUpdateRecord: useUpdateOneObjectRecordMutation,
      isDisplayModeFixHeight: true,
      isRecordFieldReadOnly: isRecordFieldReadOnly({
        isRecordReadOnly,
        isSystemObject: objectMetadataItem.isSystem,
        objectPermissions: getObjectPermissionsFromMapByObjectMetadataId({
          objectPermissionsByObjectMetadataId,
          objectMetadataId: objectMetadataItem.id,
        }),
        fieldMetadataItem: {
          id: fieldMetadataItem.id,
          isUIReadOnly: fieldMetadataItem.isUIReadOnly ?? false,
          isCustom: fieldMetadataItem.isCustom ?? false,
        },
        fieldDefinition,
        objectPermissionsByObjectMetadataId,
      }),
      onMouseEnter: () => handleMouseEnter(index + legacyActivityTargetCount),
      anchorId: `${getRecordFieldInputInstanceId({
        recordId: objectRecordId,
        fieldName: fieldMetadataItem.name,
        prefix: instanceId,
      })}`,
      isForbidden: isJunctionRelationForbidden({
        fieldMetadataItem,
        sourceObjectMetadataId: objectMetadataItem.id,
        objectMetadataItems,
        objectPermissionsByObjectMetadataId,
      }),
    }),
    [
      objectRecordId,
      fieldDefinition,
      fieldMetadataItem,
      handleMouseEnter,
      index,
      legacyActivityTargetCount,
      instanceId,
      isRecordReadOnly,
      objectMetadataItem,
      objectMetadataItems,
      objectPermissionsByObjectMetadataId,
      useUpdateOneObjectRecordMutation,
    ],
  );

  const recordFieldComponentInstanceValue = useMemo(
    () => ({
      instanceId: getRecordFieldInputInstanceId({
        recordId: objectRecordId,
        fieldName: fieldMetadataItem.name,
        prefix: instanceId,
      }),
    }),
    [objectRecordId, fieldMetadataItem.name, instanceId],
  );

  return (
    <FieldContext.Provider
      key={objectRecordId + fieldMetadataItem.id}
      value={fieldContextValue}
    >
      <RecordFieldComponentInstanceContext.Provider
        value={recordFieldComponentInstanceValue}
      >
        <RecordInlineCell loading={loading} instanceIdPrefix={instanceId} />
      </RecordFieldComponentInstanceContext.Provider>
    </FieldContext.Provider>
  );
};

const RelationFieldItem = ({
  fieldMetadataItem,
  objectRecordId,
  objectMetadataItem,
  useUpdateOneObjectRecordMutation,
  isRecordReadOnly,
  objectPermissionsByObjectMetadataId,
  loading,
}: {
  fieldMetadataItem: any;
  objectRecordId: string;
  objectMetadataItem: any;
  useUpdateOneObjectRecordMutation: any;
  isRecordReadOnly: boolean;
  objectPermissionsByObjectMetadataId: any;
  loading: boolean;
}) => {
  const fieldDefinition = useMemo(
    () =>
      formatFieldMetadataItemAsColumnDefinition({
        field: fieldMetadataItem,
        position: 0,
        objectMetadataItem,
      }),
    [fieldMetadataItem, objectMetadataItem],
  );

  const fieldContextValue = useMemo(
    () => ({
      recordId: objectRecordId,
      isLabelIdentifier: false,
      fieldDefinition,
      useUpdateRecord: useUpdateOneObjectRecordMutation,
      isDisplayModeFixHeight: true,
      isRecordFieldReadOnly: isRecordFieldReadOnly({
        isRecordReadOnly,
        isSystemObject: objectMetadataItem.isSystem,
        objectPermissions: getObjectPermissionsFromMapByObjectMetadataId({
          objectPermissionsByObjectMetadataId,
          objectMetadataId: objectMetadataItem.id,
        }),
        fieldMetadataItem: {
          id: fieldMetadataItem.id,
          isUIReadOnly: fieldMetadataItem.isUIReadOnly ?? false,
          isCustom: fieldMetadataItem.isCustom ?? false,
        },
        fieldDefinition,
        objectPermissionsByObjectMetadataId,
      }),
    }),
    [
      objectRecordId,
      fieldDefinition,
      fieldMetadataItem,
      isRecordReadOnly,
      objectMetadataItem,
      objectPermissionsByObjectMetadataId,
      useUpdateOneObjectRecordMutation,
    ],
  );

  return (
    <FieldContext.Provider
      key={objectRecordId + fieldMetadataItem.id}
      value={fieldContextValue}
    >
      {fieldMetadataItem.type === FieldMetadataType.MORPH_RELATION ? (
        <RecordDetailMorphRelationSection loading={loading} />
      ) : (
        <RecordDetailRelationSection loading={loading} />
      )}
    </FieldContext.Provider>
  );
};

export const RecordFieldList = ({
  instanceId,
  objectNameSingular,
  objectRecordId,
  showDuplicatesSection = true,
  showRelationSections = true,
  excludeFieldMetadataIds = [],
  excludeCreatedAtAndUpdatedAt = true,
}: RecordFieldListProps) => {
  const { recordLoading } = useRecordShowContainerData({
    objectRecordId,
  });

  const { objectMetadataItem } = useObjectMetadataItem({
    objectNameSingular,
  });

  const { objectPermissionsByObjectMetadataId } = useObjectPermissions();
  const { objectMetadataItems } = useObjectMetadataItems();

  const { useUpdateOneObjectRecordMutation } = useRecordShowContainerActions({
    objectNameSingular,
  });

  const isRecordReadOnly = useIsRecordReadOnly({
    recordId: objectRecordId,
    objectMetadataId: objectMetadataItem.id,
  });

  const setRecordFieldListHoverPosition = useSetAtomComponentState(
    recordFieldListHoverPositionComponentState,
    instanceId,
  );

  const handleMouseEnter = (index: number) => {
    setRecordFieldListHoverPosition(index);
  };

  const {
    inlineFieldMetadataItems,
    legacyActivityTargetFieldMetadataItems,
    boxedRelationFieldMetadataItems,
  } = useFieldListFieldMetadataItems({
    objectNameSingular,
    excludeFieldMetadataIds,
    showRelationSections,
    excludeCreatedAtAndUpdatedAt,
  });

  const recordFieldListContextValue = useMemo(
    () => ({ instanceId }),
    [instanceId],
  );

  return (
    <RecordFieldListComponentInstanceContext.Provider
      value={recordFieldListContextValue}
    >
      <PropertyBox dataTestId="record-fields-list-container">
        {legacyActivityTargetFieldMetadataItems?.map(
          (fieldMetadataItem, index) => (
            <LegacyActivityTargetFieldItem
              key={fieldMetadataItem.id}
              fieldMetadataItem={fieldMetadataItem}
              index={index}
              objectRecordId={objectRecordId}
              objectMetadataItem={objectMetadataItem}
              useUpdateOneObjectRecordMutation={
                useUpdateOneObjectRecordMutation
              }
              isRecordReadOnly={isRecordReadOnly}
              objectPermissionsByObjectMetadataId={
                objectPermissionsByObjectMetadataId
              }
              handleMouseEnter={handleMouseEnter}
              instanceId={instanceId}
              objectNameSingular={objectNameSingular}
            />
          ),
        )}
        {inlineFieldMetadataItems?.map((fieldMetadataItem, index) => (
          <InlineFieldItem
            key={fieldMetadataItem.id}
            fieldMetadataItem={fieldMetadataItem}
            index={index}
            objectRecordId={objectRecordId}
            objectMetadataItem={objectMetadataItem}
            useUpdateOneObjectRecordMutation={useUpdateOneObjectRecordMutation}
            isRecordReadOnly={isRecordReadOnly}
            objectPermissionsByObjectMetadataId={
              objectPermissionsByObjectMetadataId
            }
            objectMetadataItems={objectMetadataItems}
            handleMouseEnter={handleMouseEnter}
            legacyActivityTargetCount={
              legacyActivityTargetFieldMetadataItems?.length ?? 0
            }
            instanceId={instanceId}
            loading={recordLoading}
          />
        ))}
      </PropertyBox>
      {showDuplicatesSection && (
        <RecordDetailDuplicatesSection
          objectRecordId={objectRecordId}
          objectNameSingular={objectNameSingular}
        />
      )}
      {boxedRelationFieldMetadataItems
        .filter(
          (fieldMetadataItem) =>
            fieldMetadataItem.type === FieldMetadataType.RELATION ||
            fieldMetadataItem.type === FieldMetadataType.MORPH_RELATION,
        )
        .map((fieldMetadataItem) => (
          <RelationFieldItem
            key={fieldMetadataItem.id}
            fieldMetadataItem={fieldMetadataItem}
            objectRecordId={objectRecordId}
            objectMetadataItem={objectMetadataItem}
            useUpdateOneObjectRecordMutation={useUpdateOneObjectRecordMutation}
            isRecordReadOnly={isRecordReadOnly}
            objectPermissionsByObjectMetadataId={
              objectPermissionsByObjectMetadataId
            }
            loading={recordLoading}
          />
        ))}

      <RecordFieldListCellHoveredPortal
        objectMetadataItem={objectMetadataItem}
        recordId={objectRecordId}
      />
      <RecordFieldListCellEditModePortal
        objectMetadataItem={objectMetadataItem}
        recordId={objectRecordId}
      />
    </RecordFieldListComponentInstanceContext.Provider>
  );
};
