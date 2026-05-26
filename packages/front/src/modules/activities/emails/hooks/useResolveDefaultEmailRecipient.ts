import { useFindOneRecord } from '@/object-record/hooks/useFindOneRecord';

type UseResolveDefaultEmailRecipientParams = {
  objectNameSingular: string | null | undefined;
  recordId: string | null | undefined;
};

export const useResolveDefaultEmailRecipient = ({
  objectNameSingular,
  recordId,
}: UseResolveDefaultEmailRecipientParams) => {
  const isPenduduk = objectNameSingular === 'penduduk';

  const skipPenduduk = !isPenduduk || !recordId;

  const { record: pendudukRecord, loading: pendudukLoading } = useFindOneRecord(
    {
      objectNameSingular: 'penduduk',
      objectRecordId: recordId ?? '',
      recordGqlFields: { id: true, emails: { primaryEmail: true } },
      skip: skipPenduduk,
    },
  );

  const defaultTo = isPenduduk
    ? (pendudukRecord?.emails?.primaryEmail ?? '')
    : '';

  const loading = isPenduduk && pendudukLoading;

  return { defaultTo, loading };
};
