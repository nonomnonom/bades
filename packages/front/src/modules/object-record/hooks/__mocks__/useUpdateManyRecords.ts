import { getRecordFromRecordNode } from '@/object-record/cache/utils/getRecordFromRecordNode';
import { ObjectRecord } from '@/object-record/types/ObjectRecord';
import { gql } from '@apollo/client';
import { mockedPendudukRecords } from '~/testing/mock-data/generated/data/penduduk/mock-penduduk-data';

export const query = gql`
  mutation UpdateManyDaftarPenduduk(
    $filter: PendudukFilterInput!
    $data: PendudukUpdateInput!
  ) {
    updateDaftarPenduduk(filter: $filter, data: $data) {
      id
      __typename
    }
  }
`;

export const pendudukIds = [
  'a7286b9a-c039-4a89-9567-2dfa7953cda9',
  '37faabcd-cb39-4a0a-8618-7e3fda9afca0',
];

const flatPendudukRecords = mockedPendudukRecords.map((record) =>
  getRecordFromRecordNode({ recordNode: record }),
);

export const pendudukRecords = pendudukIds.map<ObjectRecord>((pendudukId, index) => ({
  ...flatPendudukRecords[index],
  id: pendudukId,
}));

export const updateInput = {
  pekerjaan: 'PETANI',
};

export const variables = {
  filter: {
    id: {
      in: pendudukIds,
    },
  },
  data: updateInput,
};

export const updatedPendudukRecords = pendudukIds.map<ObjectRecord>(
  (pendudukId, index) => ({
    ...flatPendudukRecords[index],
    id: pendudukId,
    pekerjaan: 'PETANI',
  }),
);

export const responseData = pendudukIds.map((id) => ({ id }));
