import {
  mockPendudukFlatFieldMetadataMaps,
  mockPendudukFlatObjectMetadata,
  mockPendudukFlatObjectMetadataMaps,
} from 'src/engine/api/graphql/graphql-query-runner/__mocks__/mockPendudukObjectMetadata';
import { mockPendudukRecords } from 'src/engine/api/graphql/graphql-query-runner/__mocks__/mockPendudukRecords';
import { buildDuplicateConditions } from 'src/engine/api/utils/build-duplicate-conditions.utils';

describe('buildDuplicateConditions', () => {
  it('should build conditions based on duplicate criteria from composite field', () => {
    const duplicateConditons = buildDuplicateConditions(
      mockPendudukFlatObjectMetadata([['emailsPrimaryEmail']]),
      mockPendudukFlatObjectMetadataMaps([['emailsPrimaryEmail']]),
      mockPendudukFlatFieldMetadataMaps(),
      mockPendudukRecords,
      'recordId',
    );

    expect(duplicateConditons).toEqual({
      or: [
        {
          emails: {
            primaryEmail: {
              eq: 'test@test.fr',
            },
          },
        },
      ],
      id: {
        neq: 'recordId',
      },
    });
  });

  it('should build conditions based on duplicate criteria from basic field', () => {
    const duplicateConditons = buildDuplicateConditions(
      mockPendudukFlatObjectMetadata([['jobTitle']]),
      mockPendudukFlatObjectMetadataMaps([['jobTitle']]),
      mockPendudukFlatFieldMetadataMaps(),
      mockPendudukRecords,
      'recordId',
    );

    expect(duplicateConditons).toEqual({
      or: [
        {
          jobTitle: {
            eq: 'Test job',
          },
        },
      ],
      id: {
        neq: 'recordId',
      },
    });
  });

  it('should not build conditions based on duplicate criteria if record value is null or too small', () => {
    const duplicateConditons = buildDuplicateConditions(
      mockPendudukFlatObjectMetadata([['linkedinLinkPrimaryLinkUrl']]),
      mockPendudukFlatObjectMetadataMaps([['linkedinLinkPrimaryLinkUrl']]),
      mockPendudukFlatFieldMetadataMaps(),
      mockPendudukRecords,
      'recordId',
    );

    expect(duplicateConditons).toEqual({});
  });

  it('should build conditions based on duplicate criteria and without recordId filter', () => {
    const duplicateConditons = buildDuplicateConditions(
      mockPendudukFlatObjectMetadata([['jobTitle']]),
      mockPendudukFlatObjectMetadataMaps([['jobTitle']]),
      mockPendudukFlatFieldMetadataMaps(),
      mockPendudukRecords,
    );

    expect(duplicateConditons).toEqual({
      or: [
        {
          jobTitle: {
            eq: 'Test job',
          },
        },
      ],
    });
  });
});
