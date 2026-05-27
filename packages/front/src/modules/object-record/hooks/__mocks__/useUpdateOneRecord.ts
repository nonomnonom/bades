import { gql } from '@apollo/client';

import { PENDUDUK_FRAGMENT_WITH_DEPTH_ONE_RELATIONS } from '@/object-record/hooks/__mocks__/pendudukFragments';

export const query = gql`
  mutation UpdateOnePenduduk($idToUpdate: UUID!, $input: PendudukUpdateInput!) {
    updatePenduduk(id: $idToUpdate, data: $input) {
      ${PENDUDUK_FRAGMENT_WITH_DEPTH_ONE_RELATIONS}
    }
  }
`;

// Catatan: bentuk data di sini mengikuti schema mock metadata aktual
// (warisan Twenty Person). Saat seed Bades SID lengkap diterapkan, mock ini
// akan diregenerasi mengikuti field SID (NIK, KK, namaLengkap, tempatLahir).
const basePenduduk = {
  __typename: 'Penduduk',
  id: '36abbb63-34ed-4a16-89f5-f549ac55d0f9',
  createdAt: '2025-01-15T08:00:00.000Z',
  createdBy: null,
  updatedAt: '2025-01-15T08:00:00.000Z',
  updatedBy: null,
  deletedAt: null,
  attachments: { edges: [], __typename: 'PendudukAttachmentsConnection' },
  avatarFile: null,
  avatarUrl: '',
  calendarEventParticipants: {
    edges: [],
    __typename: 'PendudukCalendarEventParticipantsConnection',
  },
  caredForPets: { edges: [], __typename: 'PendudukCaredForPetsConnection' },
  city: 'Denpasar',
  emails: { primaryEmail: 'budi@example.com', additionalEmails: [] },
  intro: null,
  jobTitle: 'Operator Desa',
  keluargaId: 'a0abbb63-34ed-4a16-89f5-f549ac55d0f9',
  keluarga: {
    __typename: 'Keluarga',
    id: 'a0abbb63-34ed-4a16-89f5-f549ac55d0f9',
    name: 'Keluarga Saputra',
  },
  linkedinLink: {
    primaryLinkUrl: '',
    primaryLinkLabel: '',
    secondaryLinks: [],
  },
  messageParticipants: {
    edges: [],
    __typename: 'PendudukMessageParticipantsConnection',
  },
  name: { firstName: 'Budi', lastName: 'Saputra' },
  noteTargets: { edges: [], __typename: 'PendudukNoteTargetsConnection' },
  performanceRating: 0,
  phones: {
    primaryPhoneNumber: '+62 812 3456 7890',
    primaryPhoneCountryCode: 'ID',
    primaryPhoneCallingCode: '+62',
    additionalPhones: [],
  },
  pointOfContactForOpportunities: {
    edges: [],
    __typename: 'PendudukPointOfContactForOpportunitiesConnection',
  },
  position: 0,
  previousCompanies: {
    edges: [],
    __typename: 'PendudukPreviousCompaniesConnection',
  },
  taskTargets: { edges: [], __typename: 'PendudukTaskTargetsConnection' },
  timelineActivities: {
    edges: [],
    __typename: 'PendudukTimelineActivitiesConnection',
  },
  whatsapp: {
    primaryPhoneNumber: '+62 812 3456 7890',
    primaryPhoneCountryCode: 'ID',
    primaryPhoneCallingCode: '+62',
    additionalPhones: [],
  },
  workPreference: 'KANTOR',
  xLink: {
    primaryLinkUrl: '',
    primaryLinkLabel: '',
    secondaryLinks: [],
  },
};

export const variables = {
  idToUpdate: '36abbb63-34ed-4a16-89f5-f549ac55d0f9',
  input: {
    name: { firstName: 'Budi', lastName: 'Saputra' },
  },
};

export const responseData = basePenduduk;
