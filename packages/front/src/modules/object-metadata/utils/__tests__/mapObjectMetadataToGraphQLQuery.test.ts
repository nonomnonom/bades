import { mapObjectMetadataToGraphQLQuery } from '@/object-metadata/utils/mapObjectMetadataToGraphQLQuery';
import { getTestEnrichedObjectMetadataItemsMock } from '~/testing/utils/getTestEnrichedObjectMetadataItemsMock';
import { normalizeGQLQuery } from '~/utils/normalizeGQLQuery';

const pendudukObjectMetadataItem =
  getTestEnrichedObjectMetadataItemsMock().find(
    (item) => item.nameSingular === 'penduduk',
  );

if (!pendudukObjectMetadataItem) {
  throw new Error('Metadata objek tidak ditemukan');
}

describe('mapObjectMetadataToGraphQLQuery', () => {
  it('should query only specified recordGqlFields', async () => {
    const res = mapObjectMetadataToGraphQLQuery({
      objectMetadataItems: getTestEnrichedObjectMetadataItemsMock(),
      objectMetadataItem: pendudukObjectMetadataItem,
      recordGqlFields: {
        keluarga: true,
        xLink: true,
        id: true,
        createdAt: true,
        city: true,
        email: true,
        jobTitle: true,
        name: true,
        phone: true,
        linkedinLink: true,
        updatedAt: true,
        avatarUrl: true,
        keluargaId: true,
      },
      objectPermissionsByObjectMetadataId: {
        [pendudukObjectMetadataItem.id]: {
          canReadObjectRecords: true,
          canUpdateObjectRecords: true,
          canSoftDeleteObjectRecords: true,
          canDestroyObjectRecords: true,
          objectMetadataId: pendudukObjectMetadataItem.id,
          restrictedFields: {},
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      },
    });
    expect(normalizeGQLQuery(res)).toEqual(
      normalizeGQLQuery(`{
    __typename
    name
    {
      firstName
      lastName
    }
    emails
    {
        primaryEmail
        additionalEmails
    }
    phone
    {
      primaryPhoneNumber
      primaryPhoneCountryCode
      primaryPhoneCallingCode
    }
    createdAt
    avatarUrl
    jobTitle
    city
    id
    xLink
    {
      primaryLinkUrl
      primaryLinkLabel
      secondaryLinks
    }
    keluarga
    {
    __typename
    idealCustomerProfile
    id
    xLink
    {
      primaryLinkUrl
      primaryLinkLabel
      secondaryLinks
    }
    annualRecurringRevenue
    {
      amountMicros
      currencyCode
    }
    address
    {
      addressStreet1
      addressStreet2
      addressCity
      addressState
      addressCountry
      addressPostcode
      addressLat
      addressLng
    }
    employees
    position
    name
    linkedinLink
    {
      primaryLinkUrl
      primaryLinkLabel
      secondaryLinks
    }
    createdAt
    accountOwnerId
    domainName
    {
      primaryLinkUrl
      primaryLinkLabel
      secondaryLinks
    }
    updatedAt
    }
    updatedAt
    keluargaId
    linkedinLink
    {
      primaryLinkUrl
      primaryLinkLabel
      secondaryLinks
    }
    }`),
    );
  });

  it('should load only specified operation fields nested', async () => {
    const res = mapObjectMetadataToGraphQLQuery({
      objectMetadataItems: getTestEnrichedObjectMetadataItemsMock(),
      objectMetadataItem: pendudukObjectMetadataItem,
      recordGqlFields: { keluarga: { id: true }, id: true, name: true },
      objectPermissionsByObjectMetadataId: {
        [pendudukObjectMetadataItem.id]: {
          canReadObjectRecords: true,
          canUpdateObjectRecords: true,
          canSoftDeleteObjectRecords: true,
          canDestroyObjectRecords: true,
          objectMetadataId: pendudukObjectMetadataItem.id,
          restrictedFields: {},
          rowLevelPermissionPredicates: [],
          rowLevelPermissionPredicateGroups: [],
        },
      },
    });
    expect(normalizeGQLQuery(res)).toEqual(
      normalizeGQLQuery(`{
__typename
id
keluarga
{
__typename
id
}
name
{
  firstName
  lastName
}
}`),
    );
  });
});
