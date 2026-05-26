import { parse, type FieldNode } from 'graphql';
import { graphql, http, HttpResponse, type GraphQLQuery } from 'msw';
import { getOperationName } from '~/utils/getOperationName';

import { TRACK_ANALYTICS } from '@/analytics/graphql/queries/track';
import { FIND_MANY_OBJECT_METADATA_ITEMS } from '@/object-metadata/graphql/queries';
import { GET_CURRENT_USER } from '@/users/graphql/queries/getCurrentUser';
import { REACT_APP_SERVER_BASE_URL } from '~/config';
import { mockedClientConfig } from '~/testing/mock-data/config';
import { mockedNoteRecords } from '~/testing/mock-data/generated/data/notes/mock-notes-data';
import { mockedPendudukRecords } from '~/testing/mock-data/generated/data/penduduk/mock-penduduk-data';
import { mockedWorkspaceMemberRecords } from '~/testing/mock-data/generated/data/workspaceMembers/mock-workspaceMembers-data';
import { mockedViews } from '~/testing/mock-data/generated/metadata/views/mock-views-data';
import { mockedPublicWorkspaceDataBySubdomain } from '~/testing/mock-data/publicWorkspaceDataBySubdomain';
import { mockedUserData } from '~/testing/mock-data/users';

import { GET_PUBLIC_WORKSPACE_DATA_BY_DOMAIN } from '@/auth/graphql/queries/getPublicWorkspaceDataByDomain';
import { BILLING_PORTAL_SESSION } from '@/settings/billing/graphql/queries/billingPortalSession';
import { GET_RESOURCE_CREDIT_USAGE } from '@/settings/billing/graphql/queries/getResourceCreditUsage';
import { LIST_PLANS } from '@/settings/billing/graphql/queries/listPlans';
import { GET_ROLES } from '@/settings/roles/graphql/queries/getRolesQuery';
import { mockBillingPlans } from '~/testing/mock-data/billing-plans';
import { mockedKeluargaRecords } from '~/testing/mock-data/generated/data/keluarga/mock-keluarga-data';
import { mockedTaskRecords } from '~/testing/mock-data/generated/data/tasks/mock-tasks-data';
import { mockedStandardObjectMetadataQueryResult } from '~/testing/mock-data/generated/metadata/objects/mock-objects-metadata';
import { mockedRoles } from '~/testing/mock-data/generated/metadata/roles/mock-roles-data';
import { mockedBackendCommandMenuItems } from '~/testing/mock-data/command-menu-items';

import { type Task } from '@/activities/types/Task';
import { FIND_MINIMAL_METADATA } from '@/metadata-store/graphql/queries/findMinimalMetadata';
import {
  getConnectionTypename,
  getEdgeTypename,
  isDefined,
} from 'shared/utils';
import { getEmptyPageInfo } from '@/object-record/cache/utils/getEmptyPageInfo';
import { getRecordFromRecordNode } from '@/object-record/cache/utils/getRecordFromRecordNode';
import { mockedApiKeys } from '~/testing/mock-data/generated/metadata/api-keys/mock-api-keys-data';
import { mockedMinimalMetadata } from '~/testing/mock-data/generated/metadata/minimal/mock-minimal-metadata';
import { mockedNavigationMenuItems } from '~/testing/mock-data/generated/metadata/navigation-menu-items/mock-navigation-menu-items-data';
import {
  getWorkflowMock,
  getWorkflowVersionsMock,
  workflowQueryResult,
} from '~/testing/mock-data/workflow';
import { oneSucceededWorkflowRunQueryResult } from '~/testing/mock-data/workflow-run';

const pendudukMock = [...mockedPendudukRecords];
const keluargaMock = [...mockedKeluargaRecords];
const keluargaDuplicateMock = {
  ...mockedKeluargaRecords[0],
  id: '8b40856a-2ec9-4c03-8bc0-c032c89e1824',
};

const flatTaskRecords = mockedTaskRecords.map((record) =>
  getRecordFromRecordNode<Task>({ recordNode: record }),
);

// Wraps raw server-fetched records (which already have correct field shapes)
// into a GraphQL connection response structure.
const wrapRecordsAsConnection = (
  objectNameSingular: string,
  records: Record<string, unknown>[],
) => ({
  __typename: getConnectionTypename(objectNameSingular),
  edges: records.map((node) => ({
    __typename: getEdgeTypename(objectNameSingular),
    node,
    cursor: '',
  })),
  pageInfo: getEmptyPageInfo(),
  totalCount: records.length,
});

const getRootFieldNamesFromQuery = (query: string) => {
  try {
    const document = parse(query);
    const operationDefinition = document.definitions.find(
      (definition) => definition.kind === 'OperationDefinition',
    );

    if (
      !operationDefinition ||
      operationDefinition.kind !== 'OperationDefinition'
    ) {
      return [];
    }

    return operationDefinition.selectionSet.selections
      .filter((selection): selection is FieldNode => selection.kind === 'Field')
      .map((selection) => selection.name.value);
  } catch {
    return [];
  }
};

const createEmptyRecordConnection = () => ({
  edges: [],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  },
  totalCount: 0,
});

export const metadataGraphql = graphql.link(
  `${REACT_APP_SERVER_BASE_URL}/metadata`,
);

export const graphqlMocks = {
  handlers: [
    graphql.query('IntrospectionQuery', () => {
      return HttpResponse.json({
        data: {
          __schema: {
            queryType: { name: 'Query' },
            types: [
              {
                kind: 'OBJECT',
                name: 'Query',
                fields: [
                  {
                    name: 'name',
                    type: { kind: 'SCALAR', name: 'String' },
                    args: [],
                  },
                ],
                interfaces: [],
                args: [],
              },
              {
                kind: 'SCALAR',
                name: 'String',
                fields: [],
                interfaces: [],
                args: [],
              },
            ],
            directives: [],
          },
        },
      });
    }),

    graphql.query(getOperationName(GET_CURRENT_USER) ?? '', () => {
      return HttpResponse.json({
        data: {
          currentUser: mockedUserData,
        },
      });
    }),
    graphql.query(
      getOperationName(GET_PUBLIC_WORKSPACE_DATA_BY_DOMAIN) ?? '',
      () => {
        return HttpResponse.json({
          data: {
            getPublicWorkspaceDataByDomain:
              mockedPublicWorkspaceDataBySubdomain,
          },
        });
      },
    ),
    graphql.mutation(getOperationName(TRACK_ANALYTICS) ?? '', () => {
      return HttpResponse.json({
        data: {
          track: { success: 1, __typename: 'TRACK_ANALYTICS' },
        },
      });
    }),
    http.get(`${REACT_APP_SERVER_BASE_URL}/client-config`, () => {
      return HttpResponse.json(mockedClientConfig);
    }),
    metadataGraphql.query(
      getOperationName(FIND_MANY_OBJECT_METADATA_ITEMS) ?? '',
      () => {
        return HttpResponse.json({
          data: mockedStandardObjectMetadataQueryResult,
        });
      },
    ),
    metadataGraphql.query(getOperationName(FIND_MINIMAL_METADATA) ?? '', () => {
      return HttpResponse.json({
        data: { minimalMetadata: mockedMinimalMetadata },
      });
    }),
    metadataGraphql.query('FindAllViews', () => {
      return HttpResponse.json({
        data: { getViews: mockedViews },
      });
    }),
    metadataGraphql.query('FindFieldsWidgetViews', () => {
      return HttpResponse.json({
        data: {
          getViews: mockedViews.filter((view) => view.type === 'FIELDS_WIDGET'),
        },
      });
    }),
    metadataGraphql.query('FindTableWidgetViews', () => {
      return HttpResponse.json({
        data: {
          getViews: mockedViews.filter((view) => view.type === 'TABLE_WIDGET'),
        },
      });
    }),
    metadataGraphql.query('FindAllRecordPageLayouts', () => {
      return HttpResponse.json({
        data: { getPageLayouts: [] },
      });
    }),
    metadataGraphql.query('FindManyLogicFunctions', () => {
      return HttpResponse.json({
        data: { findManyLogicFunctions: [] },
      });
    }),
    metadataGraphql.query('FindManyNavigationMenuItems', () => {
      return HttpResponse.json({
        data: { navigationMenuItems: mockedNavigationMenuItems },
      });
    }),
    metadataGraphql.query('FindManyCommandMenuItems', () => {
      return HttpResponse.json({
        data: { commandMenuItems: mockedBackendCommandMenuItems },
      });
    }),
    graphql.query('SearchDaftarPenduduk', () => {
      return HttpResponse.json({
        data: {
          searchDaftarPenduduk: {
            edges: pendudukMock.slice(0, 3).map((penduduk) => ({
              node: penduduk,
              cursor: null,
            })),
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
          },
        },
      });
    }),
    graphql.query('SearchDaftarKeluarga', () => {
      return HttpResponse.json({
        data: {
          searchDaftarKeluarga: {
            edges: keluargaMock.slice(0, 3).map((keluarga) => ({
              node: keluarga,
              cursor: null,
            })),
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
          },
        },
      });
    }),
    graphql.query('Search', () => {
      const pendudukSearchEdges = pendudukMock
        .slice(0, 2)
        .map((penduduk: Record<string, unknown>, index: number) => ({
          node: {
            __typename: 'SearchRecordDTO',
            recordId: penduduk.id,
            objectNameSingular: 'penduduk',
            objectLabelSingular: 'Penduduk',
            label:
              `${((penduduk.namaLengkap ?? penduduk.name) as Record<string, string>)?.firstName ?? ''} ${((penduduk.namaLengkap ?? penduduk.name) as Record<string, string>)?.lastName ?? ''}`.trim(),
            imageUrl: '',
            tsRankCD: 0.2,
            tsRank: 0.12158542,
          },
          cursor: `cursor-${index + 1}`,
        }));

      const keluargaSearchEdges = keluargaMock
        .slice(0, 2)
        .map((keluarga: Record<string, unknown>, index: number) => ({
          node: {
            __typename: 'SearchRecordDTO',
            recordId: keluarga.id,
            objectNameSingular: 'keluarga',
            objectLabelSingular: 'Keluarga',
            label: (keluarga.nomorKk ?? keluarga.name) as string,
            imageUrl: '',
            tsRankCD: 0.2,
            tsRank: 0.12158542,
          },
          cursor: `cursor-${pendudukSearchEdges.length + index + 1}`,
        }));

      const allEdges = [...pendudukSearchEdges, ...keluargaSearchEdges];

      return HttpResponse.json({
        data: {
          search: {
            edges: allEdges,
            pageInfo: {
              hasNextPage: true,
              endCursor: allEdges[allEdges.length - 1]?.cursor ?? null,
            },
          },
        },
      });
    }),
    graphql.query('CombinedFindManyRecords', ({ query }) => {
      const rootFieldNames = getRootFieldNamesFromQuery(query ?? '');
      const data = Object.fromEntries(
        rootFieldNames.map((fieldName) => [
          fieldName,
          createEmptyRecordConnection(),
        ]),
      );

      return HttpResponse.json({ data });
    }),
    graphql.query('FindManyViews', ({ variables }) => {
      const objectMetadataId = variables.filter?.objectMetadataId?.eq;
      const viewType = variables.filter?.type?.eq;

      const filtered = mockedViews.filter(
        (view) =>
          (isDefined(objectMetadataId)
            ? view?.objectMetadataId === objectMetadataId
            : true) && (isDefined(viewType) ? view?.type === viewType : true),
      );

      return HttpResponse.json({
        data: {
          views: {
            edges: filtered.map((view) => ({
              node: {
                ...view,
                viewFields: {
                  edges: view.viewFields.map((viewField) => ({
                    node: viewField,
                    cursor: null,
                  })),
                  totalCount: view.viewFields.length,
                },
              },
              cursor: null,
            })),
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
          },
        },
      });
    }),
    graphql.query('SearchWorkspaceMembers', () => {
      return HttpResponse.json({
        data: {
          searchWorkspaceMembers: wrapRecordsAsConnection(
            'workspaceMember',
            mockedWorkspaceMemberRecords as Record<string, unknown>[],
          ),
        },
      });
    }),
    graphql.query('FindManyViewFields', ({ variables }) => {
      const viewId = variables.filter.view.eq;

      const matchingView = mockedViews.find((view) => view.id === viewId);
      const viewFields = matchingView?.viewFields ?? [];

      return HttpResponse.json({
        data: {
          viewFields: {
            edges: viewFields.map((viewField) => ({
              node: viewField,
              cursor: null,
            })),
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
          },
        },
      });
    }),
    graphql.query('FindManyDaftarKeluarga', ({ variables }) => {
      const mockedData = variables.limit
        ? keluargaMock.slice(0, variables.limit)
        : keluargaMock;

      return HttpResponse.json({
        data: {
          daftarKeluarga: wrapRecordsAsConnection('keluarga', mockedData),
        },
      });
    }),
    graphql.query('FindDuplicateKeluarga', () => {
      return HttpResponse.json({
        data: {
          keluargaDuplicates: [
            wrapRecordsAsConnection('keluarga', [keluargaDuplicateMock]),
          ],
        },
      });
    }),
    graphql.query('FindManyDaftarPenduduk', () => {
      return HttpResponse.json({
        data: {
          daftarPenduduk: wrapRecordsAsConnection('penduduk', pendudukMock),
        },
      });
    }),
    graphql.query('FindManyNotes', () => {
      return HttpResponse.json({
        data: {
          notes: wrapRecordsAsConnection('note', [...mockedNoteRecords]),
        },
      });
    }),
    graphql.query('FindManyTasks', () => {
      return HttpResponse.json({
        data: {
          tasks: wrapRecordsAsConnection('task', [...mockedTaskRecords]),
        },
      });
    }),
    graphql.query('FindManyTaskTargets', () => {
      const taskTargetNodes = flatTaskRecords.flatMap(
        (task) => task.taskTargets ?? [],
      );

      return HttpResponse.json({
        data: {
          taskTargets: wrapRecordsAsConnection(
            'taskTarget',
            taskTargetNodes as Record<string, unknown>[],
          ),
        },
      });
    }),
    graphql.query('FindManyOpportunities', () => {
      return HttpResponse.json({
        data: {
          opportunities: {
            edges: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
          },
        },
      });
    }),
    graphql.query('FindManyWorkspaceMembers', () => {
      return HttpResponse.json({
        data: {
          workspaceMembers: wrapRecordsAsConnection(
            'workspaceMember',
            mockedWorkspaceMemberRecords as Record<string, unknown>[],
          ),
        },
      });
    }),
    graphql.query<GraphQLQuery, { objectRecordId: string }>(
      'FindOnePenduduk',
      ({ variables: { objectRecordId } }) => {
        return HttpResponse.json({
          data: {
            penduduk: pendudukMock.find(
              (penduduk) => penduduk.id === objectRecordId,
            ),
          },
        });
      },
    ),
    graphql.query('FindManyWorkflows', () => {
      return HttpResponse.json({
        data: workflowQueryResult,
      });
    }),
    graphql.query('FindOneWorkflow', () => {
      return HttpResponse.json({
        data: {
          workflow: getWorkflowMock(),
        },
      });
    }),
    graphql.query('FindOneWorkflowRun', () => {
      return HttpResponse.json({
        data: oneSucceededWorkflowRunQueryResult,
      });
    }),
    graphql.query('FindManyWorkflowVersions', () => {
      return HttpResponse.json({
        data: {
          workflowVersions: getWorkflowVersionsMock(),
        },
      });
    }),
    graphql.query(getOperationName(GET_ROLES) ?? '', () => {
      return HttpResponse.json({
        data: {
          getRoles: mockedRoles,
        },
      });
    }),
    graphql.query(getOperationName(LIST_PLANS) ?? '', () => {
      return HttpResponse.json({
        data: mockBillingPlans,
      });
    }),
    graphql.query(getOperationName(GET_RESOURCE_CREDIT_USAGE) ?? '', () => {
      return HttpResponse.json({
        data: {
          getResourceCreditUsage: [
            {
              __typename: 'BillingResourceCreditUsage',
              productKey: 'RESOURCE_CREDIT',
              usedCredits: 1000,
              grantedCredits: 500000,
              rolloverCredits: 0,
              totalGrantedCredits: 500000,
              unitPriceCents: 1,
            },
          ],
        },
      });
    }),
    graphql.query(getOperationName(BILLING_PORTAL_SESSION) ?? '', () => {
      return HttpResponse.json({
        data: {
          billingPortalSession: {
            __typename: 'BillingSession',
            url: 'http://localhost:3001/settings/billing',
          },
        },
      });
    }),
    http.get('https://chat-assets.frontapp.com/v1/chat.bundle.js', () => {
      return HttpResponse.text(
        `
          window.FrontChat = () => {};
          console.log("This is a mocked script response.");
          // Additional JavaScript code here
        `,
        { status: 200 },
      );
    }),
    metadataGraphql.query('GetApiKeys', () => {
      return HttpResponse.json({
        data: {
          apiKeys: mockedApiKeys,
        },
      });
    }),
    metadataGraphql.query('GetApiKey', ({ variables }) => {
      const apiKeyId = variables.input?.id;
      const apiKey = mockedApiKeys.find((key) => key.id === apiKeyId);

      return HttpResponse.json({
        data: {
          apiKey: apiKey ?? null,
        },
      });
    }),
    metadataGraphql.mutation('CreateApiKey', ({ variables }) => {
      const input = variables.input;
      const newApiKey = {
        __typename: 'ApiKey',
        id: '20202020-1234-1234-1234-123456789012',
        name: input.name,
        expiresAt: input.expiresAt,
        revokedAt: null,
        role: {
          __typename: 'Role',
          id: input.roleId,
          label: input.roleId === '2' ? 'Guest' : 'Admin',
          icon: input.roleId === '2' ? 'IconUser' : 'IconSettings',
        },
      };

      return HttpResponse.json({
        data: {
          createApiKey: newApiKey,
        },
      });
    }),
    metadataGraphql.mutation('AssignRoleToApiKey', () => {
      return HttpResponse.json({
        data: {
          assignRoleToApiKey: true,
        },
      });
    }),
    metadataGraphql.mutation('GenerateApiKeyToken', () => {
      return HttpResponse.json({
        data: {
          generateApiKeyToken: {
            __typename: 'ApiKeyToken',
            token: 'test-api-key-token-12345',
          },
        },
      });
    }),
    metadataGraphql.mutation('RevokeApiKey', ({ variables }) => {
      return HttpResponse.json({
        data: {
          revokeApiKey: {
            __typename: 'ApiKey',
            id: variables.input?.id,
            name: 'Zapier Integration',
            expiresAt: '2100-11-06T23:59:59.825Z',
            revokedAt: new Date().toISOString(),
            role: {
              __typename: 'Role',
              id: '1',
              label: 'Admin',
              icon: 'IconSettings',
            },
          },
        },
      });
    }),
    metadataGraphql.mutation('UpdateApiKey', ({ variables }) => {
      return HttpResponse.json({
        data: {
          updateApiKey: {
            __typename: 'ApiKey',
            id: variables.input.id,
            name: variables.input.name || 'Updated API Key',
            expiresAt: '2100-11-06T23:59:59.825Z',
            revokedAt: null,
            role: {
              __typename: 'Role',
              id: '1',
              label: 'Admin',
              icon: 'IconSettings',
            },
          },
        },
      });
    }),
    metadataGraphql.query('GetWebhooks', () => {
      return HttpResponse.json({
        data: {
          webhooks: [
            {
              __typename: 'Webhook',
              id: '1234',
              targetUrl: 'https://api.slackbot.io/webhooks/bades',
              operations: ['*.created', '*.updated'],
              description: 'Slack notifications for lead updates',
              secret: 'sample-secret',
            },
          ],
        },
      });
    }),
    metadataGraphql.query('GetWebhook', ({ variables }) => {
      const webhookId = variables.input?.id;

      return HttpResponse.json({
        data: {
          webhook: {
            __typename: 'Webhook',
            id: webhookId || '1234',
            targetUrl: 'https://api.slackbot.io/webhooks/bades',
            operations: ['*.created', '*.updated'],
            description: 'Slack notifications for lead updates',
            secret: 'sample-secret',
          },
        },
      });
    }),
  ],
};
