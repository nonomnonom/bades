import { recordMapFieldMetadataIdComponentState } from '@/object-record/record-map/states/recordMapFieldMetadataIdComponentState';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';

describe('recordMapFieldMetadataIdComponentState', () => {
  it('should have the correct key', () => {
    expect(recordMapFieldMetadataIdComponentState.key).toBe(
      'recordMapFieldMetadataIdComponentState',
    );
  });

  it('should have null as default value per instance', () => {
    const instanceAtom = recordMapFieldMetadataIdComponentState.atomFamily({
      instanceId: 'test-record-index',
    });
    expect(jotaiStore.get(instanceAtom)).toBeNull();
  });
});
