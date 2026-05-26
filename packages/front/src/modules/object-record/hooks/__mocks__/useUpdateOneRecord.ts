import { PENDUDUK_FRAGMENT_WITH_DEPTH_ONE_RELATIONS } from '@/object-record/hooks/__mocks__/pendudukFragments';
import { gql } from '@apollo/client';

export const query = gql`
  mutation UpdateOnePerson($idToUpdate: UUID!, $input: PersonUpdateInput!) {
    updatePenduduk(id: $idToUpdate, data: $input) {
      ${PENDUDUK_FRAGMENT_WITH_DEPTH_ONE_RELATIONS}
    }
  }
`;

const basePerson = {
  id: '36abbb63-34ed-4a16-89f5-f549ac55d0f9',
  xLink: {
    primaryLinkUrl: '',
    primaryLinkLabel: '',
    secondaryLinks: [],
  },
  createdAt: '',
  city: '',
  jobTitle: '',
  name: {
    firstName: '',
    lastName: '',
  },
  linkedinLink: {
    primaryLinkUrl: '',
    primaryLinkLabel: '',
    secondaryLinks: [],
  },
  updatedAt: '',
  avatarUrl: '',
  companyId: '',
};

const connectedObjects = {
  opportunities: {
    edges: [],
  },
  pointOfContactForOpportunities: {
    edges: [],
  },
  activityTargets: {
    edges: [],
  },
  attachments: {
    edges: [],
  },
  company: {
    id: '',
  },
};

export const variables = {
  idToUpdate: '36abbb63-34ed-4a16-89f5-f549ac55d0f9',
  input: {
    name: { firstName: 'John', lastName: 'Doe' },
  },
};

export const responseData = {
  ...{ ...basePerson, __typename: 'Person' },
  ...connectedObjects,
};
