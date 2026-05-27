import { renderHook } from '@testing-library/react';
import { Provider as JotaiProvider } from 'jotai';

import { useGetObjectRecordIdentifierByNameSingular } from '@/object-metadata/hooks/useGetObjectRecordIdentifierByNameSingular';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';
import { setTestObjectMetadataItemsInMetadataStore } from '~/testing/utils/setTestObjectMetadataItemsInMetadataStore';
import { getTestEnrichedObjectMetadataItemsMock } from '~/testing/utils/getTestEnrichedObjectMetadataItemsMock';

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <JotaiProvider store={jotaiStore}>{children}</JotaiProvider>
);

describe('useGetObjectRecordIdentifierByNameSingular', () => {
  beforeEach(() => {
    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
  });

  it('should work as expected', async () => {
    const { result, rerender } = renderHook(
      ({
        record,
        objectNameSingular,
      }: {
        record: any;
        objectNameSingular: string;
      }) => {
        return useGetObjectRecordIdentifierByNameSingular(true)(
          record,
          objectNameSingular,
        );
      },
      {
        wrapper: Wrapper,
        initialProps: {
          record: { id: 'recordId' } as any,
          objectNameSingular: 'blocklist',
        },
      },
    );

    expect(result.current.linkToShowPage).toBe('/object/blocklist/recordId');

    rerender({
      record: { id: 'recordId', avatarUrl: 'https://fake-url.com' },
      objectNameSingular: 'programBantuan',
    });

    expect(result.current.linkToShowPage).toBe(
      '/object/programBantuan/recordId',
    );

    rerender({
      record: {
        id: 'recordId',
        name: { firstName: 'Budi', lastName: 'Santoso' },
      },
      objectNameSingular: 'penduduk',
    });

    expect(result.current.linkToShowPage).toBe('/object/penduduk/recordId');
    expect(result.current.name).toBe('Budi Santoso');
    expect(result.current.avatarType).toBe('rounded');

    rerender({
      record: {
        id: 'recordId',
        domainName: 'https://cool-keluarga.com',
      },
      objectNameSingular: 'keluarga',
    });

    expect(result.current.linkToShowPage).toBe('/object/keluarga/recordId');
    // Layanan favicon eksternal sudah dilepas dari Bades; avatarUrl jatuh ke
    // image identifier field value (kosong untuk fixture ini).
    expect(result.current.avatarUrl).toBe('');
    expect(result.current.avatarType).toBe('rounded');
  });
});
