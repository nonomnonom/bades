import { PENDUDUK_FRAGMENT_WITH_DEPTH_ONE_RELATIONS } from '@/object-record/hooks/__mocks__/pendudukFragments';
import { gql } from '@apollo/client';

export const query = gql`
  mutation CreateOnePerson($input: PersonCreateInput!) {
    createPenduduk(data: $input) {
      ${PENDUDUK_FRAGMENT_WITH_DEPTH_ONE_RELATIONS}
    }
  }
`;

export const responseData = {
  opportunities: {
    edges: [],
  },
  xLink: {
    primaryLinkUrl: '',
    primaryLinkLabel: '',
    secondaryLinks: [],
  },
  pointOfContactForOpportunities: {
    edges: [],
  },
  createdAt: '',
  company: {
    id: '',
  },
  city: '',
  email: '',
  activityTargets: {
    edges: [],
  },
  jobTitle: '',
  attachments: {
    edges: [],
  },
  name: {
    firstName: '',
    lastName: '',
  },
  phones: {
    primaryPhoneCountryCode: '',
    primaryPhoneCallingCode: '',
    primaryPhoneNumber: '',
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
