import { getObjectMetadataIdsInDraft } from '@/navigation-menu-item/common/utils/getObjectMetadataIdsInDraft';
import { NavigationMenuItemType } from 'shared/types';

describe('getObjectMetadataIdsInDraft', () => {
  it('should collect objectMetadataId from OBJECT-type items', () => {
    const draft = [
      {
        type: NavigationMenuItemType.OBJECT,
        targetObjectMetadataId: 'object-daftarPenduduk',
      },
    ];

    const result = getObjectMetadataIdsInDraft(draft);

    expect(result).toEqual(new Set(['object-daftarPenduduk']));
  });

  it('should NOT collect objectMetadataId from VIEW-type items', () => {
    const draft = [
      {
        type: NavigationMenuItemType.VIEW,
        targetObjectMetadataId: 'object-daftarPenduduk',
      },
    ];

    const result = getObjectMetadataIdsInDraft(draft);

    expect(result.size).toBe(0);
  });

  it('should NOT collect objectMetadataId from RECORD-type items', () => {
    const draft = [
      {
        type: NavigationMenuItemType.RECORD,
        targetObjectMetadataId: 'object-daftarPenduduk',
      },
    ];

    const result = getObjectMetadataIdsInDraft(draft);

    expect(result.size).toBe(0);
  });

  it('should skip RECORD and VIEW items but collect from OBJECT items', () => {
    const draft = [
      {
        type: NavigationMenuItemType.RECORD,
        targetObjectMetadataId: 'object-daftarPenduduk',
      },
      {
        type: NavigationMenuItemType.VIEW,
        targetObjectMetadataId: 'object-daftarPenduduk',
      },
      {
        type: NavigationMenuItemType.OBJECT,
        targetObjectMetadataId: 'object-daftarKeluarga',
      },
    ];

    const result = getObjectMetadataIdsInDraft(draft);

    expect(result.has('object-daftarPenduduk')).toBe(false);
    expect(result.has('object-daftarKeluarga')).toBe(true);
  });

  it('should collect from multiple OBJECT items', () => {
    const draft = [
      {
        type: NavigationMenuItemType.OBJECT,
        targetObjectMetadataId: 'object-daftarPenduduk',
      },
      {
        type: NavigationMenuItemType.OBJECT,
        targetObjectMetadataId: 'object-daftarKeluarga',
      },
    ];

    const result = getObjectMetadataIdsInDraft(draft);

    expect(result).toEqual(new Set(['object-daftarPenduduk', 'object-daftarKeluarga']));
  });

  it('should skip FOLDER and LINK items', () => {
    const draft = [
      { type: NavigationMenuItemType.FOLDER },
      { type: NavigationMenuItemType.LINK },
    ];

    const result = getObjectMetadataIdsInDraft(draft);

    expect(result.size).toBe(0);
  });

  it('should handle an empty draft', () => {
    const result = getObjectMetadataIdsInDraft([]);

    expect(result.size).toBe(0);
  });

  it('should skip OBJECT items without targetObjectMetadataId', () => {
    const draft = [
      {
        type: NavigationMenuItemType.OBJECT,
      },
    ];

    const result = getObjectMetadataIdsInDraft(draft);

    expect(result.size).toBe(0);
  });
});
