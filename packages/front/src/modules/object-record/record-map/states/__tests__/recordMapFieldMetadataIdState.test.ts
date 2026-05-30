import { recordMapFieldMetadataIdState } from '@/object-record/record-map/states/recordMapFieldMetadataIdState';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';

describe('recordMapFieldMetadataIdState', () => {
  it('should have the correct key', () => {
    expect(recordMapFieldMetadataIdState.key).toBe(
      'recordMapFieldMetadataIdState',
    );
  });

  it('should have null as default value', () => {
    const value = jotaiStore.get(recordMapFieldMetadataIdState.atom);
    expect(value).toBeNull();
  });
});
