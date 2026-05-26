import {
  mockPersonFlatFieldMetadataMaps,
  mockPersonFlatObjectMetadata,
  mockPersonFlatObjectMetadataMaps,
} from 'src/engine/api/graphql/graphql-query-runner/__mocks__/mockPendudukObjectMetadata';
import { mockPendudukRecords } from 'src/engine/api/graphql/graphql-query-runner/__mocks__/mockPendudukRecords';
import { buildDuplicateConditions } from 'src/engine/api/utils/build-duplicate-conditions.utils';

describe('buildDuplicateConditions', () => {
  it('should build conditions based on duplicate criteria from composite field', () => {
    const duplicateConditons = buildDuplicateConditions(
      mockPersonFlatObjectMetadata([['emailsPrimaryEmail']]),
      mockPersonFlatObjectMetadataMaps([['emailsPrimaryEmail']]),
      mockPersonFlatFieldMetadataMaps(),
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
      mockPersonFlatObjectMetadata([['jobTitle']]),
      mockPersonFlatObjectMetadataMaps([['jobTitle']]),
      mockPersonFlatFieldMetadataMaps(),
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
      mockPersonFlatObjectMetadata([['linkedinLinkPrimaryLinkUrl']]),
      mockPersonFlatObjectMetadataMaps([['linkedinLinkPrimaryLinkUrl']]),
      mockPersonFlatFieldMetadataMaps(),
      mockPendudukRecords,
      'recordId',
    );

    expect(duplicateConditons).toEqual({});
  });

  it('should build conditions based on duplicate criteria and without recordId filter', () => {
    const duplicateConditons = buildDuplicateConditions(
      mockPersonFlatObjectMetadata([['jobTitle']]),
      mockPersonFlatObjectMetadataMaps([['jobTitle']]),
      mockPersonFlatFieldMetadataMaps(),
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
