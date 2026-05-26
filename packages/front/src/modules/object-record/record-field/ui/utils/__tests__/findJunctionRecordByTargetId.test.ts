import { findJunctionRecordByTargetId } from '@/object-record/record-field/ui/utils/junction/findJunctionRecordByTargetId';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';

const createMockJunctionRecord = (
  id: string,
  targetData: Record<string, unknown>,
): ObjectRecord =>
  ({
    id,
    __typename: 'JunctionObject',
    ...targetData,
  }) as ObjectRecord;

describe('findJunctionRecordByTargetId', () => {
  it('should return undefined for empty junction records', () => {
    const result = findJunctionRecordByTargetId({
      junctionRecords: [],
      targetRecordId: 'target-1',
      targetFieldName: 'company',
    });
    expect(result).toBeUndefined();
  });

  it('should find junction record by target field name', () => {
    const junctionRecords = [
      createMockJunctionRecord('junction-1', {
        kartuKeluarga: { id: 'keluarga-1', name: 'Keluarga Santoso' },
      }),
      createMockJunctionRecord('junction-2', {
        kartuKeluarga: { id: 'keluarga-2', name: 'Keluarga Wijaya' },
      }),
    ];

    const result = findJunctionRecordByTargetId({
      junctionRecords,
      targetRecordId: 'company-2',
      targetFieldName: 'company',
    });

    expect(result?.id).toBe('junction-2');
  });

  it('should return undefined when target record is not found', () => {
    const junctionRecords = [
      createMockJunctionRecord('junction-1', {
        kartuKeluarga: { id: 'keluarga-1', name: 'Keluarga Santoso' },
      }),
    ];

    const result = findJunctionRecordByTargetId({
      junctionRecords,
      targetRecordId: 'non-existent',
      targetFieldName: 'company',
    });

    expect(result).toBeUndefined();
  });

  it('should skip undefined junction records', () => {
    const junctionRecords = [
      undefined as unknown as ObjectRecord,
      createMockJunctionRecord('junction-1', {
        kartuKeluarga: { id: 'keluarga-1', name: 'Keluarga Santoso' },
      }),
    ];

    const result = findJunctionRecordByTargetId({
      junctionRecords,
      targetRecordId: 'company-1',
      targetFieldName: 'company',
    });

    expect(result?.id).toBe('junction-1');
  });

  it('should handle null target objects', () => {
    const junctionRecords = [
      createMockJunctionRecord('junction-1', { kartuKeluarga: null }),
      createMockJunctionRecord('junction-2', {
        kartuKeluarga: { id: 'keluarga-1', name: 'Keluarga Santoso' },
      }),
    ];

    const result = findJunctionRecordByTargetId({
      junctionRecords,
      targetRecordId: 'company-1',
      targetFieldName: 'company',
    });

    expect(result?.id).toBe('junction-2');
  });

  it('should handle target objects without id property', () => {
    const junctionRecords = [
      createMockJunctionRecord('junction-1', {
        kartuKeluarga: { name: 'No ID Company' },
      }),
      createMockJunctionRecord('junction-2', {
        kartuKeluarga: { id: 'keluarga-1', name: 'Keluarga Santoso' },
      }),
    ];

    const result = findJunctionRecordByTargetId({
      junctionRecords,
      targetRecordId: 'company-1',
      targetFieldName: 'company',
    });

    expect(result?.id).toBe('junction-2');
  });

  it('should work with different target field names', () => {
    const junctionRecords = [
      createMockJunctionRecord('junction-1', {
        person: { id: 'penduduk-1', name: 'John Doe' },
        kartuKeluarga: { id: 'keluarga-1', name: 'Keluarga Santoso' },
      }),
    ];

    const personResult = findJunctionRecordByTargetId({
      junctionRecords,
      targetRecordId: 'person-1',
      targetFieldName: 'person',
    });
    expect(personResult?.id).toBe('junction-1');

    const companyResult = findJunctionRecordByTargetId({
      junctionRecords,
      targetRecordId: 'company-1',
      targetFieldName: 'company',
    });
    expect(companyResult?.id).toBe('junction-1');
  });
});
