import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { COMMAND_MENU_DEFAULT_ICON } from '@/workflow/workflow-trigger/constants/CommandMenuDefaultIcon';
import { getManualTriggerDefaultSettings } from '@/workflow/workflow-trigger/utils/getManualTriggerDefaultSettings';

const mockObjectMetadataItems: EnrichedObjectMetadataItem[] = [
  {
    id: 'company-id',
    nameSingular: 'keluarga',
    namePlural: 'daftarKeluarga',
    labelSingular: 'Keluarga',
    labelPlural: 'Keluarga',
    icon: 'IconBuilding',
    fields: [],
    createdAt: new Date(),
  } as unknown as EnrichedObjectMetadataItem,
];

describe('getManualTriggerDefaultSettings', () => {
  describe('GLOBAL availability', () => {
    it('should return correct settings for GLOBAL type', () => {
      const result = getManualTriggerDefaultSettings({
        availabilityType: 'GLOBAL',
        activeNonSystemObjectMetadataItems: mockObjectMetadataItems,
      });

      expect(result).toEqual({
        objectType: undefined,
        availability: {
          type: 'GLOBAL',
          locations: undefined,
        },
        outputSchema: {},
        icon: COMMAND_MENU_DEFAULT_ICON,
        isPinned: false,
      });
    });

    it('should use custom icon when provided', () => {
      const result = getManualTriggerDefaultSettings({
        availabilityType: 'GLOBAL',
        activeNonSystemObjectMetadataItems: mockObjectMetadataItems,
        icon: 'IconCustom',
      });

      expect(result.icon).toBe('IconCustom');
    });

    it('should use isPinned when provided', () => {
      const result = getManualTriggerDefaultSettings({
        availabilityType: 'GLOBAL',
        activeNonSystemObjectMetadataItems: mockObjectMetadataItems,
        isPinned: true,
      });

      expect(result.isPinned).toBe(true);
    });
  });

  describe('SINGLE_RECORD availability', () => {
    it('should return correct settings for SINGLE_RECORD type', () => {
      const result = getManualTriggerDefaultSettings({
        availabilityType: 'SINGLE_RECORD',
        activeNonSystemObjectMetadataItems: mockObjectMetadataItems,
      });

      expect(result).toEqual({
        objectType: 'keluarga',
        availability: {
          type: 'SINGLE_RECORD',
          objectNameSingular: 'keluarga',
        },
        outputSchema: {},
        icon: COMMAND_MENU_DEFAULT_ICON,
        isPinned: false,
      });
    });

    it('should use the first object metadata item', () => {
      const multipleObjects: EnrichedObjectMetadataItem[] = [
        ...mockObjectMetadataItems,
        {
          id: 'person-id',
          nameSingular: 'penduduk',
          namePlural: 'daftarPenduduk',
          labelSingular: 'Penduduk',
          labelPlural: 'Penduduk',
          icon: 'IconUser',
          fields: [],
        } as unknown as EnrichedObjectMetadataItem,
      ];

      const result = getManualTriggerDefaultSettings({
        availabilityType: 'SINGLE_RECORD',
        activeNonSystemObjectMetadataItems: multipleObjects,
      });

      expect(result.objectType).toBe('keluarga');
      expect(
        (result.availability as { objectNameSingular: string })
          .objectNameSingular,
      ).toBe('keluarga');
    });
  });

  describe('BULK_RECORDS availability', () => {
    it('should return correct settings for BULK_RECORDS type', () => {
      const result = getManualTriggerDefaultSettings({
        availabilityType: 'BULK_RECORDS',
        activeNonSystemObjectMetadataItems: mockObjectMetadataItems,
      });

      expect(result).toEqual({
        objectType: 'keluarga',
        availability: {
          type: 'BULK_RECORDS',
          objectNameSingular: 'keluarga',
        },
        outputSchema: {},
        icon: COMMAND_MENU_DEFAULT_ICON,
        isPinned: false,
      });
    });
  });
});
