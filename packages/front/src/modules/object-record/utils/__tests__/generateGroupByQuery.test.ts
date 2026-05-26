import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { generateGroupByAggregateQuery } from '@/object-record/record-aggregate/utils/generateGroupByAggregateQuery';

describe('generateGroupByQuery', () => {
  const testCases = [
    {
      description: 'single aggregate operation',
      objectMetadataItem: {
        nameSingular: 'programBantuan',
        namePlural: 'programBantuans',
      },
      aggregateOperations: ['sumAmountAmountMicros'],
    },
    {
      description: 'multiple aggregate operations',
      objectMetadataItem: {
        nameSingular: 'programBantuan',
        namePlural: 'programBantuans',
      },
      aggregateOperations: [
        'totalCount',
        'sumAmountAmountMicros',
        'avgAmountAmountMicros',
      ],
    },
    {
      description: 'empty aggregate operations',
      objectMetadataItem: {
        nameSingular: 'penduduk',
        namePlural: 'penduduks',
      },
      aggregateOperations: [],
    },
  ];

  it.each(testCases)(
    'should generate valid GraphQL query for $description',
    ({ objectMetadataItem, aggregateOperations }) => {
      const result = generateGroupByAggregateQuery({
        objectMetadataItem: objectMetadataItem as EnrichedObjectMetadataItem,
        aggregateOperationGqlFields: aggregateOperations,
      });

      expect(result.loc?.source.body).toMatchSnapshot();
    },
  );
});
