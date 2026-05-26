import { getOrderByFieldForObjectMetadataItem } from '@/object-metadata/utils/getObjectOrderByField';
import { getTestEnrichedObjectMetadataItemsMock } from '~/testing/utils/getTestEnrichedObjectMetadataItemsMock';

describe('getObjectOrderByField', () => {
  it('should work as expected', () => {
    const objectMetadataItem = getTestEnrichedObjectMetadataItemsMock().find(
      (item) => item.nameSingular === 'penduduk',
    )!;
    const res = getOrderByFieldForObjectMetadataItem(objectMetadataItem);
    expect(res).toEqual([
      { name: { firstName: 'AscNullsLast' } },
      { name: { lastName: 'AscNullsLast' } },
    ]);
  });
});
