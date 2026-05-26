import { type Decorator } from '@storybook/react-vite';
import { useCallback, useEffect } from 'react';

import { type Task } from '@/activities/types/Task';
import { formatFieldMetadataItemAsColumnDefinition } from '@/object-metadata/utils/formatFieldMetadataItemAsColumnDefinition';
import { isLabelIdentifierField } from '@/object-metadata/utils/isLabelIdentifierField';
import { getRecordFromRecordNode } from '@/object-record/cache/utils/getRecordFromRecordNode';
import { FieldContext } from '@/object-record/record-field/ui/contexts/FieldContext';
import { RecordFieldComponentInstanceContext } from '@/object-record/record-field/ui/states/contexts/RecordFieldComponentInstanceContext';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';
import { CustomError, isDefined } from 'shared/utils';
import { mockedKeluargaRecords } from '~/testing/mock-data/generated/data/keluarga/mock-keluarga-data';
import { mockedTaskRecords } from '~/testing/mock-data/generated/data/tasks/mock-tasks-data';
import { mockedPendudukRecords } from '~/testing/mock-data/generated/data/penduduk/mock-penduduk-data';
import { getMockFieldMetadataItemOrThrow } from '~/testing/utils/getMockFieldMetadataItemOrThrow';
import { getMockObjectMetadataItemOrThrow } from '~/testing/utils/getMockObjectMetadataItemOrThrow';

const mockedTasks = mockedTaskRecords.map((record) =>
  getRecordFromRecordNode<Task>({ recordNode: record }),
);

const RecordMockSetterEffect = ({
  keluargas,
  penduduks,
  tasks,
}: {
  keluargas: ObjectRecord[];
  penduduks: ObjectRecord[];
  tasks: ObjectRecord[];
}) => {
  const setRecordInStores = useCallback((record: ObjectRecord) => {
    jotaiStore.set(recordStoreFamilyState.atomFamily(record.id), record);
  }, []);

  useEffect(() => {
    for (const keluarga of keluargas) {
      setRecordInStores(keluarga);
    }

    for (const penduduk of penduduks) {
      setRecordInStores(penduduk);
    }

    for (const task of tasks) {
      setRecordInStores(task);
    }
  }, [keluargas, penduduks, tasks, setRecordInStores]);

  return null;
};

export const getFieldDecorator =
  (
    objectNameSingular: 'keluarga' | 'penduduk' | 'task' | 'workflowVersions',
    fieldName: string,
    fieldValue?: any,
  ): Decorator =>
  (Story) => {
    const keluargasMock = [...mockedKeluargaRecords];

    const keluargas =
      objectNameSingular === 'keluarga' && isDefined(fieldValue)
        ? [
            { ...keluargasMock[0], [fieldName]: fieldValue },
            ...keluargasMock.slice(1),
          ]
        : keluargasMock;

    const pendudukMock = [...mockedPendudukRecords];

    const penduduks =
      objectNameSingular === 'penduduk' && isDefined(fieldValue)
        ? [
            { ...pendudukMock[0], [fieldName]: fieldValue },
            ...pendudukMock.slice(1),
          ]
        : pendudukMock;

    const tasksMock = mockedTasks;

    const tasks =
      objectNameSingular === 'task'
        ? [{ ...tasksMock[0], [fieldName]: fieldValue }, ...tasksMock.slice(1)]
        : tasksMock;

    const record =
      objectNameSingular === 'keluarga'
        ? keluargas[0]
        : objectNameSingular === 'penduduk'
          ? penduduks[0]
          : tasks[0];

    if (isDefined(fieldValue)) {
      (record as any)[fieldName] = fieldValue;
    }

    const objectMetadataItem =
      getMockObjectMetadataItemOrThrow(objectNameSingular);

    const fieldMetadataItem = getMockFieldMetadataItemOrThrow({
      objectMetadataItem,
      fieldName,
    });

    if (!isDefined(objectMetadataItem)) {
      throw new CustomError(
        `Object ${objectNameSingular} not found`,
        'OBJECT_NOT_FOUND',
      );
    }

    if (!isDefined(fieldMetadataItem)) {
      throw new Error(
        `Field ${fieldName} not found in object ${objectNameSingular}`,
      );
    }

    const isLabelIdentifier = isLabelIdentifierField({
      fieldMetadataItem,
      objectMetadataItem,
    });

    return (
      <RecordFieldComponentInstanceContext.Provider
        value={{
          instanceId: 'record-field-component-instance-id',
        }}
      >
        <FieldContext.Provider
          value={{
            fieldMetadataItemId: fieldMetadataItem.id,
            recordId: record.id,
            isLabelIdentifier,
            fieldDefinition: formatFieldMetadataItemAsColumnDefinition({
              field: fieldMetadataItem,
              position: 0,
              objectMetadataItem,
            }),
            isRecordFieldReadOnly: false,
          }}
        >
          <RecordMockSetterEffect
            keluargas={keluargas}
            penduduks={penduduks}
            tasks={tasks}
          />
          <Story />
        </FieldContext.Provider>
      </RecordFieldComponentInstanceContext.Provider>
    );
  };
