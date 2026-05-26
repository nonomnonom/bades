import { getRecordFromRecordNode } from '@/object-record/cache/utils/getRecordFromRecordNode';
import { ObjectRecord } from '@/object-record/types/ObjectRecord';
import { gql } from '@apollo/client';
import { mockedPendudukRecords } from '~/testing/mock-data/generated/data/penduduk/mock-penduduk-data';

export const query = gql`
  mutation UpdateManyPenduduks(
    $filter: PendudukFilterInput!
    $data: PendudukUpdateInput!
  ) {
    updatePenduduks(filter: $filter, data: $data) {
      id
      __typename
    }
  }
`;

export const personIds = [
  'a7286b9a-c039-4a89-9567-2dfa7953cda9',
  '37faabcd-cb39-4a0a-8618-7e3fda9afca0',
];

const flatPersonRecords = mockedPendudukRecords.map((record) =>
  getRecordFromRecordNode({ recordNode: record }),
);

export const personRecords = personIds.map<ObjectRecord>((personId, index) => ({
  ...flatPersonRecords[index],
  id: personId,
}));

export const updateInput = {
  tempatLahir: 'Kota Baru',
};

export const variables = {
  filter: {
    id: {
      in: personIds,
    },
  },
  data: updateInput,
};

export const updatedPersonRecords = personIds.map<ObjectRecord>(
  (personId, index) => ({
    ...flatPersonRecords[index],
    id: personId,
    tempatLahir: 'Kota Baru',
  }),
);

export const responseData = personIds.map((personId) => ({ id: personId }));
