import { renderHook } from '@testing-library/react';

import { objectMetadataItemsSelector } from '@/object-metadata/states/objectMetadataItemsSelector';
import { useGetAvailableFieldsForMap } from '@/views/view-picker/hooks/useGetAvailableFieldsForMap';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { FieldMetadataType } from 'shared/types';

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/objects/keluarga', search: '' }),
}));

jest.mock('~/hooks/useNavigateSettings', () => ({
  useNavigateSettings: () => jest.fn(),
}));

jest.mock(
  '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue',
  () => ({
    useAtomComponentStateValue: jest.fn(),
  }),
);

jest.mock('@/ui/utilities/state/jotai/hooks/useAtomStateValue', () => ({
  useAtomStateValue: jest.fn(),
}));

jest.mock('@/ui/utilities/state/jotai/hooks/useSetAtomState', () => ({
  useSetAtomState: () => jest.fn(),
}));

const mockUseAtomComponentStateValue = useAtomComponentStateValue as jest.Mock;
const mockUseAtomStateValue = useAtomStateValue as jest.Mock;

const MOCK_OBJECT_ID = 'object-keluarga-1';

describe('useGetAvailableFieldsForMap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAtomComponentStateValue.mockReturnValue(MOCK_OBJECT_ID);
  });

  it('should return only active ADDRESS fields', () => {
    mockUseAtomStateValue.mockImplementation((selector) => {
      if (selector === objectMetadataItemsSelector) {
        return [
          {
            id: MOCK_OBJECT_ID,
            nameSingular: 'keluarga',
            namePlural: 'daftarKeluarga',
            readableFields: [
              {
                id: 'field-text',
                name: 'nomorKartuKeluarga',
                type: FieldMetadataType.TEXT,
                isActive: true,
              },
              {
                id: 'field-address-active',
                name: 'alamat',
                type: FieldMetadataType.ADDRESS,
                isActive: true,
              },
              {
                id: 'field-address-inactive',
                name: 'lokasiLama',
                type: FieldMetadataType.ADDRESS,
                isActive: false,
              },
            ],
          },
        ];
      }

      return [];
    });

    const { result } = renderHook(() => useGetAvailableFieldsForMap());

    expect(result.current.availableFieldsForMap).toHaveLength(1);
    expect(result.current.availableFieldsForMap[0]?.id).toBe(
      'field-address-active',
    );
  });
});
