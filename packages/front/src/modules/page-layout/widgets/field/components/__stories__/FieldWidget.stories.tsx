import { type ApolloClient } from '@apollo/client';
import { useApolloClient } from '@apollo/client/react';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { isMinimalMetadataReadyState } from '@/metadata-store/states/isMinimalMetadataReadyState';
import { ApolloCoreClientContext } from '@/object-metadata/contexts/ApolloCoreClientContext';
import { recordStoreFamilyState } from '@/object-record/record-store/states/recordStoreFamilyState';
import { type ObjectRecord } from '@/object-record/types/ObjectRecord';
import { PageLayoutContentProvider } from '@/page-layout/contexts/PageLayoutContentContext';
import {
  PAGE_LAYOUT_TEST_INSTANCE_ID,
  PageLayoutTestWrapper,
} from '@/page-layout/hooks/__tests__/PageLayoutTestWrapper';
import { pageLayoutDraftComponentState } from '@/page-layout/states/pageLayoutDraftComponentState';
import { pageLayoutPersistedComponentState } from '@/page-layout/states/pageLayoutPersistedComponentState';
import { type PageLayout } from '@/page-layout/types/PageLayout';
import { type PageLayoutWidget } from '@/page-layout/types/PageLayoutWidget';
import { FieldWidget } from '@/page-layout/widgets/field/components/FieldWidget';
import { WidgetComponentInstanceContext } from '@/page-layout/widgets/states/contexts/WidgetComponentInstanceContext';
import { LayoutRenderingProvider } from '@/ui/layout/contexts/LayoutRenderingContext';
import { jotaiStore } from '@/ui/utilities/state/jotai/jotaiStore';
import { CoreObjectNameSingular } from 'shared/types';
import { ComponentDecorator } from 'ui/testing';
import {
  FieldDisplayMode,
  PageLayoutTabLayoutMode,
  PageLayoutType,
  WidgetConfigurationType,
  WidgetType,
} from '~/generated-metadata/graphql';
import { ChipGeneratorsDecorator } from '~/testing/decorators/ChipGeneratorsDecorator';
import { FileUploadDecorator } from '~/testing/decorators/FileUploadDecorator';
import { getJestMetadataAndApolloMocksWrapper } from '~/testing/jest/getJestMetadataAndApolloMocksWrapper';
import { getTestEnrichedObjectMetadataItemsMock } from '~/testing/utils/getTestEnrichedObjectMetadataItemsMock';
import { getMockFieldMetadataItemOrThrow } from '~/testing/utils/getMockFieldMetadataItemOrThrow';
import { getMockObjectMetadataItemOrThrow } from '~/testing/utils/getMockObjectMetadataItemOrThrow';
import { setTestObjectMetadataItemsInMetadataStore } from '~/testing/utils/setTestObjectMetadataItemsInMetadataStore';

const companyObjectMetadataItem = getMockObjectMetadataItemOrThrow('company');

const personObjectMetadataItem = getMockObjectMetadataItemOrThrow('person');

const opportunityObjectMetadataItem =
  getMockObjectMetadataItemOrThrow('opportunity');

const timelineActivityObjectMetadataItem = getMockObjectMetadataItemOrThrow(
  CoreObjectNameSingular.TimelineActivity,
);

const nameField = getMockFieldMetadataItemOrThrow({
  objectMetadataItem: companyObjectMetadataItem,
  fieldName: 'name',
});

const addressField = getMockFieldMetadataItemOrThrow({
  objectMetadataItem: companyObjectMetadataItem,
  fieldName: 'address',
});

const employeesField = getMockFieldMetadataItemOrThrow({
  objectMetadataItem: companyObjectMetadataItem,
  fieldName: 'employees',
});

const linkedinField = getMockFieldMetadataItemOrThrow({
  objectMetadataItem: companyObjectMetadataItem,
  fieldName: 'linkedinLink',
});

const accountOwnerField = getMockFieldMetadataItemOrThrow({
  objectMetadataItem: companyObjectMetadataItem,
  fieldName: 'accountOwner',
});

const idealCustomerProfileField = getMockFieldMetadataItemOrThrow({
  objectMetadataItem: companyObjectMetadataItem,
  fieldName: 'idealCustomerProfile',
});

const annualRecurringRevenueField = getMockFieldMetadataItemOrThrow({
  objectMetadataItem: companyObjectMetadataItem,
  fieldName: 'annualRecurringRevenue',
});

const personEmailsField = getMockFieldMetadataItemOrThrow({
  objectMetadataItem: personObjectMetadataItem,
  fieldName: 'emails',
});

const personPhonesField = getMockFieldMetadataItemOrThrow({
  objectMetadataItem: personObjectMetadataItem,
  fieldName: 'phones',
});

const opportunityStageField = getMockFieldMetadataItemOrThrow({
  objectMetadataItem: opportunityObjectMetadataItem,
  fieldName: 'stage',
});

const companyWorkPolicyField = getMockFieldMetadataItemOrThrow({
  objectMetadataItem: companyObjectMetadataItem,
  fieldName: 'workPolicy',
});

const companyPeopleField = getMockFieldMetadataItemOrThrow({
  objectMetadataItem: companyObjectMetadataItem,
  fieldName: 'daftarPenduduk',
});

const timelineActivityWorkspaceMemberField = getMockFieldMetadataItemOrThrow({
  objectMetadataItem: timelineActivityObjectMetadataItem,
  fieldName: 'workspaceMember',
});

const TEST_RECORD_ID = 'test-record-123';
const TEST_PERSON_RECORD_ID = 'test-person-456';
const TEST_OPPORTUNITY_RECORD_ID = 'test-opportunity-789';
const TEST_TIMELINE_ACTIVITY_RECORD_ID = 'test-timeline-def';

const mockPersonRecord: ObjectRecord = {
  __typename: 'Penduduk',
  id: TEST_PERSON_RECORD_ID,
  name: {
    __typename: 'FullName',
    firstName: 'Siti',
    lastName: 'Santoso',
  },
  emails: {
    __typename: 'Emails',
    primaryEmail: 'siti.santoso@bades.id',
    additionalEmails: ['siti@personal.id'],
  },
  phones: {
    __typename: 'Phones',
    primaryPhoneNumber: '5551234567',
    primaryPhoneCountryCode: '+1',
    primaryPhoneCallingCode: '+1',
    additionalPhones: [],
  },
};

const mockOpportunityRecord: ObjectRecord = {
  __typename: 'ProgramBantuan',
  id: TEST_OPPORTUNITY_RECORD_ID,
  name: 'Enterprise Deal',
  stage: 'PROPOSAL',
  amount: {
    __typename: 'Currency',
    amountMicros: 500000000000,
    currencyCode: 'IDR',
  },
  closeDate: '2025-12-31T00:00:00Z',
};

const mockWorkspaceMemberRecord: ObjectRecord = {
  __typename: 'WorkspaceMember',
  id: 'test-workspace-member-xyz',
  name: {
    __typename: 'FullName',
    firstName: 'Sari',
    lastName: 'Jaya',
  },
  avatarUrl: '',
  userEmail: 'sari.jaya@bades.id',
  colorScheme: 'Light',
  locale: 'id',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  userId: 'test-user-xyz',
};

const mockTimelineActivityRecord: ObjectRecord = {
  __typename: 'TimelineActivity',
  id: TEST_TIMELINE_ACTIVITY_RECORD_ID,
  name: 'Catatan dibuat',
  workspaceMember: {
    __typename: 'WorkspaceMember',
    id: 'test-workspace-member-xyz',
    name: {
      __typename: 'FullName',
      firstName: 'Sari',
      lastName: 'Jaya',
    },
    avatarUrl: '',
    userEmail: 'sari.jaya@bades.id',
    colorScheme: 'Light',
    locale: 'id',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    userId: 'test-user-xyz',
  },
  happenedAt: '2025-01-15T10:30:00Z',
};

const mockCompanyRecord: ObjectRecord = {
  __typename: 'Keluarga',
  id: TEST_RECORD_ID,
  name: 'Keluarga Anggrek',
  address: {
    addressStreet1: 'Jl. Sukamaju No. 1',
    addressStreet2: null,
    addressCity: 'Desa Sukamaju',
    addressState: 'Jawa Tengah',
    addressPostcode: '57521',
    addressCountry: 'Indonesia',
    addressLat: null,
    addressLng: null,
  },
  employees: 250,
  linkedinLink: {
    primaryLinkUrl: 'https://linkedin.com/company/acme',
    primaryLinkLabel: null,
    secondaryLinks: null,
  },
  idealCustomerProfile: true,
  annualRecurringRevenue: {
    __typename: 'Currency',
    amountMicros: 5000000000000,
    currencyCode: 'IDR',
  },
  workPolicy: ['ON_SITE', 'HYBRID'],
  people: [
    {
      __typename: 'Penduduk',
      id: TEST_PERSON_RECORD_ID,
      name: {
        __typename: 'FullName',
        firstName: 'Siti',
        lastName: 'Santoso',
      },
    },
  ],
  accountOwner: {
    __typename: 'WorkspaceMember',
    id: '20202020-0687-4c41-b707-ed1bfca972a7',
    name: {
      __typename: 'FullName',
      firstName: 'Budi',
      lastName: 'Saputra',
    },
    avatarUrl: '',
    userEmail: 'budi.saputra@bades.id',
    colorScheme: 'Light',
    locale: 'id',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    userId: '20202020-9e3b-46d4-a556-88b9ddc2b034',
  },
};

// Sets a record in both Jotai stores so field display hooks can read it
const setRecordInStores = (recordId: string, record: ObjectRecord) => {
  jotaiStore.set(recordStoreFamilyState.atomFamily(recordId), record);
};

const JestMetadataAndApolloMocksWrapper = getJestMetadataAndApolloMocksWrapper({
  apolloMocks: [],
});

const CoreClientProviderWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const apolloClient = useApolloClient() as ApolloClient;

  return (
    <ApolloCoreClientContext.Provider value={apolloClient}>
      {children}
    </ApolloCoreClientContext.Provider>
  );
};

const TAB_ID_OVERVIEW = 'tab-overview';

const createPageLayoutWithWidget = (
  widget: PageLayoutWidget,
  objectMetadataId: string,
): PageLayout => ({
  id: PAGE_LAYOUT_TEST_INSTANCE_ID,
  name: 'Mock Page Layout',
  type: PageLayoutType.RECORD_PAGE,
  objectMetadataId,
  universalIdentifier: '20202020-0000-0000-0000-000000000001',
  tabs: [
    {
      __typename: 'PageLayoutTab' as const,
      isActive: true,
      applicationId: '',
      id: TAB_ID_OVERVIEW,
      title: 'Ringkasan',
      position: 0,
      pageLayoutId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      widgets: [widget],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    },
  ],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  deletedAt: null,
});

const meta: Meta<typeof FieldWidget> = {
  title: 'Modules/PageLayout/Widgets/FieldWidget',
  component: FieldWidget,
  decorators: [
    ComponentDecorator,
    ChipGeneratorsDecorator,
    FileUploadDecorator,
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof FieldWidget>;

export const TextFieldWidget: Story = {
  render: () => {
    const widget: PageLayoutWidget = {
      __typename: 'PageLayoutWidget',
      applicationId: '',
      isActive: true,
      id: 'widget-text-field',
      pageLayoutTabId: TAB_ID_OVERVIEW,
      type: WidgetType.FIELD,
      title: 'Nama Keluarga',
      objectMetadataId: companyObjectMetadataItem.id,
      gridPosition: {
        __typename: 'GridPosition',
        row: 0,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
      },
      configuration: {
        __typename: 'FieldConfiguration',
        configurationType: WidgetConfigurationType.FIELD,
        fieldMetadataId: nameField.id,
        fieldDisplayMode: FieldDisplayMode.FIELD,
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
    jotaiStore.set(isMinimalMetadataReadyState.atom, true);
    const pageLayoutData = createPageLayoutWithWidget(
      widget,
      companyObjectMetadataItem.id,
    );
    jotaiStore.set(
      pageLayoutPersistedComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    jotaiStore.set(
      pageLayoutDraftComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    setRecordInStores(TEST_RECORD_ID, mockCompanyRecord);

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <JestMetadataAndApolloMocksWrapper>
          <CoreClientProviderWrapper>
            <PageLayoutTestWrapper store={jotaiStore}>
              <LayoutRenderingProvider
                value={{
                  isInSidePanel: false,
                  layoutType: PageLayoutType.RECORD_PAGE,
                  targetRecordIdentifier: {
                    id: TEST_RECORD_ID,
                    targetObjectNameSingular:
                      companyObjectMetadataItem.nameSingular,
                  },
                }}
              >
                <PageLayoutContentProvider
                  value={{
                    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
                    tabId: 'fields',
                  }}
                >
                  <WidgetComponentInstanceContext.Provider
                    value={{ instanceId: widget.id }}
                  >
                    <FieldWidget widget={widget} />
                  </WidgetComponentInstanceContext.Provider>
                </PageLayoutContentProvider>
              </LayoutRenderingProvider>
            </PageLayoutTestWrapper>
          </CoreClientProviderWrapper>
        </JestMetadataAndApolloMocksWrapper>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const companyName = await canvas.findByText('Keluarga Anggrek');
    expect(companyName).toBeVisible();
  },
};

export const AddressFieldWidget: Story = {
  render: () => {
    const widget: PageLayoutWidget = {
      __typename: 'PageLayoutWidget',
      applicationId: '',
      isActive: true,
      id: 'widget-address-field',
      pageLayoutTabId: TAB_ID_OVERVIEW,
      type: WidgetType.FIELD,
      title: 'Alamat',
      objectMetadataId: companyObjectMetadataItem.id,
      gridPosition: {
        __typename: 'GridPosition',
        row: 1,
        column: 0,
        rowSpan: 1,
        columnSpan: 3,
      },
      configuration: {
        __typename: 'FieldConfiguration',
        configurationType: WidgetConfigurationType.FIELD,
        fieldMetadataId: addressField.id,
        fieldDisplayMode: FieldDisplayMode.FIELD,
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
    jotaiStore.set(isMinimalMetadataReadyState.atom, true);
    const pageLayoutData = createPageLayoutWithWidget(
      widget,
      companyObjectMetadataItem.id,
    );
    jotaiStore.set(
      pageLayoutPersistedComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    jotaiStore.set(
      pageLayoutDraftComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    setRecordInStores(TEST_RECORD_ID, mockCompanyRecord);

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <JestMetadataAndApolloMocksWrapper>
          <CoreClientProviderWrapper>
            <PageLayoutTestWrapper store={jotaiStore}>
              <LayoutRenderingProvider
                value={{
                  isInSidePanel: false,
                  layoutType: PageLayoutType.RECORD_PAGE,
                  targetRecordIdentifier: {
                    id: TEST_RECORD_ID,
                    targetObjectNameSingular:
                      companyObjectMetadataItem.nameSingular,
                  },
                }}
              >
                <PageLayoutContentProvider
                  value={{
                    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
                    tabId: 'fields',
                  }}
                >
                  <WidgetComponentInstanceContext.Provider
                    value={{ instanceId: widget.id }}
                  >
                    <FieldWidget widget={widget} />
                  </WidgetComponentInstanceContext.Provider>
                </PageLayoutContentProvider>
              </LayoutRenderingProvider>
            </PageLayoutTestWrapper>
          </CoreClientProviderWrapper>
        </JestMetadataAndApolloMocksWrapper>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const street = await canvas.findByText(/Jl\. Sukamaju No\. 1/i);
    expect(street).toBeVisible();

    const city = await canvas.findByText(/Desa Sukamaju/i);
    expect(city).toBeVisible();
  },
};

export const NumberFieldWidget: Story = {
  render: () => {
    const widget: PageLayoutWidget = {
      __typename: 'PageLayoutWidget',
      applicationId: '',
      isActive: true,
      id: 'widget-number-field',
      pageLayoutTabId: TAB_ID_OVERVIEW,
      type: WidgetType.FIELD,
      title: 'Jumlah Anggota',
      objectMetadataId: companyObjectMetadataItem.id,
      gridPosition: {
        __typename: 'GridPosition',
        row: 2,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
      },
      configuration: {
        __typename: 'FieldConfiguration',
        configurationType: WidgetConfigurationType.FIELD,
        fieldMetadataId: employeesField.id,
        fieldDisplayMode: FieldDisplayMode.FIELD,
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
    jotaiStore.set(isMinimalMetadataReadyState.atom, true);
    const pageLayoutData = createPageLayoutWithWidget(
      widget,
      companyObjectMetadataItem.id,
    );
    jotaiStore.set(
      pageLayoutPersistedComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    jotaiStore.set(
      pageLayoutDraftComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    setRecordInStores(TEST_RECORD_ID, mockCompanyRecord);

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <JestMetadataAndApolloMocksWrapper>
          <CoreClientProviderWrapper>
            <PageLayoutTestWrapper store={jotaiStore}>
              <LayoutRenderingProvider
                value={{
                  isInSidePanel: false,
                  layoutType: PageLayoutType.RECORD_PAGE,
                  targetRecordIdentifier: {
                    id: TEST_RECORD_ID,
                    targetObjectNameSingular:
                      companyObjectMetadataItem.nameSingular,
                  },
                }}
              >
                <PageLayoutContentProvider
                  value={{
                    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
                    tabId: 'fields',
                  }}
                >
                  <WidgetComponentInstanceContext.Provider
                    value={{ instanceId: widget.id }}
                  >
                    <FieldWidget widget={widget} />
                  </WidgetComponentInstanceContext.Provider>
                </PageLayoutContentProvider>
              </LayoutRenderingProvider>
            </PageLayoutTestWrapper>
          </CoreClientProviderWrapper>
        </JestMetadataAndApolloMocksWrapper>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const employeeCount = await canvas.findByText('250');
    expect(employeeCount).toBeVisible();
  },
};

export const LinkFieldWidget: Story = {
  render: () => {
    const widget: PageLayoutWidget = {
      __typename: 'PageLayoutWidget',
      applicationId: '',
      isActive: true,
      id: 'widget-link-field',
      pageLayoutTabId: TAB_ID_OVERVIEW,
      type: WidgetType.FIELD,
      title: 'Tautan LinkedIn',
      objectMetadataId: companyObjectMetadataItem.id,
      gridPosition: {
        __typename: 'GridPosition',
        row: 3,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
      },
      configuration: {
        __typename: 'FieldConfiguration',
        configurationType: WidgetConfigurationType.FIELD,
        fieldMetadataId: linkedinField.id,
        fieldDisplayMode: FieldDisplayMode.FIELD,
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
    jotaiStore.set(isMinimalMetadataReadyState.atom, true);
    const pageLayoutData = createPageLayoutWithWidget(
      widget,
      companyObjectMetadataItem.id,
    );
    jotaiStore.set(
      pageLayoutPersistedComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    jotaiStore.set(
      pageLayoutDraftComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    setRecordInStores(TEST_RECORD_ID, mockCompanyRecord);

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <JestMetadataAndApolloMocksWrapper>
          <CoreClientProviderWrapper>
            <PageLayoutTestWrapper store={jotaiStore}>
              <LayoutRenderingProvider
                value={{
                  isInSidePanel: false,
                  layoutType: PageLayoutType.RECORD_PAGE,
                  targetRecordIdentifier: {
                    id: TEST_RECORD_ID,
                    targetObjectNameSingular:
                      companyObjectMetadataItem.nameSingular,
                  },
                }}
              >
                <PageLayoutContentProvider
                  value={{
                    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
                    tabId: 'fields',
                  }}
                >
                  <WidgetComponentInstanceContext.Provider
                    value={{ instanceId: widget.id }}
                  >
                    <FieldWidget widget={widget} />
                  </WidgetComponentInstanceContext.Provider>
                </PageLayoutContentProvider>
              </LayoutRenderingProvider>
            </PageLayoutTestWrapper>
          </CoreClientProviderWrapper>
        </JestMetadataAndApolloMocksWrapper>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const linkedinLink = await canvas.findByText(/acme/i);
    expect(linkedinLink).toBeVisible();
  },
};

export const ManyToOneRelationFieldWidget: Story = {
  render: () => {
    const widget: PageLayoutWidget = {
      __typename: 'PageLayoutWidget',
      applicationId: '',
      isActive: true,
      id: 'widget-relation-field',
      pageLayoutTabId: TAB_ID_OVERVIEW,
      type: WidgetType.FIELD,
      title: 'Pengelola Akun',
      objectMetadataId: companyObjectMetadataItem.id,
      gridPosition: {
        __typename: 'GridPosition',
        row: 4,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
      },
      configuration: {
        __typename: 'FieldConfiguration',
        configurationType: WidgetConfigurationType.FIELD,
        fieldMetadataId: accountOwnerField.id,
        fieldDisplayMode: FieldDisplayMode.FIELD,
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
    jotaiStore.set(isMinimalMetadataReadyState.atom, true);
    const pageLayoutData = createPageLayoutWithWidget(
      widget,
      companyObjectMetadataItem.id,
    );
    jotaiStore.set(
      pageLayoutPersistedComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    jotaiStore.set(
      pageLayoutDraftComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    setRecordInStores(TEST_RECORD_ID, mockCompanyRecord);
    // Set the related WorkspaceMember record for relation field display
    if (
      mockCompanyRecord.accountOwner !== null &&
      mockCompanyRecord.accountOwner !== undefined
    ) {
      setRecordInStores(
        mockCompanyRecord.accountOwner.id,
        mockCompanyRecord.accountOwner,
      );
    }

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <JestMetadataAndApolloMocksWrapper>
          <CoreClientProviderWrapper>
            <PageLayoutTestWrapper store={jotaiStore}>
              <LayoutRenderingProvider
                value={{
                  isInSidePanel: false,
                  layoutType: PageLayoutType.RECORD_PAGE,
                  targetRecordIdentifier: {
                    id: TEST_RECORD_ID,
                    targetObjectNameSingular:
                      companyObjectMetadataItem.nameSingular,
                  },
                }}
              >
                <PageLayoutContentProvider
                  value={{
                    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
                    tabId: 'fields',
                  }}
                >
                  <WidgetComponentInstanceContext.Provider
                    value={{ instanceId: widget.id }}
                  >
                    <FieldWidget widget={widget} />
                  </WidgetComponentInstanceContext.Provider>
                </PageLayoutContentProvider>
              </LayoutRenderingProvider>
            </PageLayoutTestWrapper>
          </CoreClientProviderWrapper>
        </JestMetadataAndApolloMocksWrapper>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const accountOwner = await canvas.findByText('Budi Saputra');
    expect(accountOwner).toBeVisible();
  },
};

export const OneToManyRelationFieldWidget: Story = {
  render: () => {
    const widget: PageLayoutWidget = {
      __typename: 'PageLayoutWidget',
      applicationId: '',
      isActive: true,
      id: 'widget-one-to-many-relation-field',
      pageLayoutTabId: TAB_ID_OVERVIEW,
      type: WidgetType.FIELD,
      title: 'Daftar Anggota',
      objectMetadataId: companyObjectMetadataItem.id,
      gridPosition: {
        __typename: 'GridPosition',
        row: 11,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
      },
      configuration: {
        __typename: 'FieldConfiguration',
        configurationType: WidgetConfigurationType.FIELD,
        fieldMetadataId: companyPeopleField.id,
        fieldDisplayMode: FieldDisplayMode.FIELD,
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
    jotaiStore.set(isMinimalMetadataReadyState.atom, true);
    const pageLayoutData = createPageLayoutWithWidget(
      widget,
      companyObjectMetadataItem.id,
    );
    jotaiStore.set(
      pageLayoutPersistedComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    jotaiStore.set(
      pageLayoutDraftComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    setRecordInStores(TEST_RECORD_ID, mockCompanyRecord);
    // Set the related Person record for ONE_TO_MANY relation display
    setRecordInStores(TEST_PERSON_RECORD_ID, mockPersonRecord);

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <JestMetadataAndApolloMocksWrapper>
          <CoreClientProviderWrapper>
            <PageLayoutTestWrapper store={jotaiStore}>
              <LayoutRenderingProvider
                value={{
                  isInSidePanel: false,
                  layoutType: PageLayoutType.RECORD_PAGE,
                  targetRecordIdentifier: {
                    id: TEST_RECORD_ID,
                    targetObjectNameSingular:
                      companyObjectMetadataItem.nameSingular,
                  },
                }}
              >
                <PageLayoutContentProvider
                  value={{
                    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
                    tabId: 'fields',
                  }}
                >
                  <WidgetComponentInstanceContext.Provider
                    value={{ instanceId: widget.id }}
                  >
                    <FieldWidget widget={widget} />
                  </WidgetComponentInstanceContext.Provider>
                </PageLayoutContentProvider>
              </LayoutRenderingProvider>
            </PageLayoutTestWrapper>
          </CoreClientProviderWrapper>
        </JestMetadataAndApolloMocksWrapper>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const personChip = await canvas.findByText('Siti Santoso');
    expect(personChip).toBeVisible();
  },
};

export const BooleanFieldWidget: Story = {
  render: () => {
    const widget: PageLayoutWidget = {
      __typename: 'PageLayoutWidget',
      applicationId: '',
      isActive: true,
      id: 'widget-boolean-field',
      pageLayoutTabId: TAB_ID_OVERVIEW,
      type: WidgetType.FIELD,
      title: 'Profil Pelanggan Ideal',
      objectMetadataId: companyObjectMetadataItem.id,
      gridPosition: {
        __typename: 'GridPosition',
        row: 5,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
      },
      configuration: {
        __typename: 'FieldConfiguration',
        configurationType: WidgetConfigurationType.FIELD,
        fieldMetadataId: idealCustomerProfileField.id,
        fieldDisplayMode: FieldDisplayMode.FIELD,
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
    jotaiStore.set(isMinimalMetadataReadyState.atom, true);
    const pageLayoutData = createPageLayoutWithWidget(
      widget,
      companyObjectMetadataItem.id,
    );
    jotaiStore.set(
      pageLayoutPersistedComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    jotaiStore.set(
      pageLayoutDraftComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    setRecordInStores(TEST_RECORD_ID, mockCompanyRecord);

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <JestMetadataAndApolloMocksWrapper>
          <CoreClientProviderWrapper>
            <PageLayoutTestWrapper store={jotaiStore}>
              <LayoutRenderingProvider
                value={{
                  isInSidePanel: false,
                  layoutType: PageLayoutType.RECORD_PAGE,
                  targetRecordIdentifier: {
                    id: TEST_RECORD_ID,
                    targetObjectNameSingular:
                      companyObjectMetadataItem.nameSingular,
                  },
                }}
              >
                <PageLayoutContentProvider
                  value={{
                    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
                    tabId: 'fields',
                  }}
                >
                  <WidgetComponentInstanceContext.Provider
                    value={{ instanceId: widget.id }}
                  >
                    <FieldWidget widget={widget} />
                  </WidgetComponentInstanceContext.Provider>
                </PageLayoutContentProvider>
              </LayoutRenderingProvider>
            </PageLayoutTestWrapper>
          </CoreClientProviderWrapper>
        </JestMetadataAndApolloMocksWrapper>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText('True')).toBeVisible();
  },
};

export const CurrencyFieldWidget: Story = {
  render: () => {
    const widget: PageLayoutWidget = {
      __typename: 'PageLayoutWidget',
      applicationId: '',
      isActive: true,
      id: 'widget-currency-field',
      pageLayoutTabId: TAB_ID_OVERVIEW,
      type: WidgetType.FIELD,
      title: 'Pendapatan Tahunan Berulang',
      objectMetadataId: companyObjectMetadataItem.id,
      gridPosition: {
        __typename: 'GridPosition',
        row: 6,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
      },
      configuration: {
        __typename: 'FieldConfiguration',
        configurationType: WidgetConfigurationType.FIELD,
        fieldMetadataId: annualRecurringRevenueField.id,
        fieldDisplayMode: FieldDisplayMode.FIELD,
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
    jotaiStore.set(isMinimalMetadataReadyState.atom, true);
    const pageLayoutData = createPageLayoutWithWidget(
      widget,
      companyObjectMetadataItem.id,
    );
    jotaiStore.set(
      pageLayoutPersistedComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    jotaiStore.set(
      pageLayoutDraftComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    setRecordInStores(TEST_RECORD_ID, mockCompanyRecord);

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <JestMetadataAndApolloMocksWrapper>
          <CoreClientProviderWrapper>
            <PageLayoutTestWrapper store={jotaiStore}>
              <LayoutRenderingProvider
                value={{
                  isInSidePanel: false,
                  layoutType: PageLayoutType.RECORD_PAGE,
                  targetRecordIdentifier: {
                    id: TEST_RECORD_ID,
                    targetObjectNameSingular:
                      companyObjectMetadataItem.nameSingular,
                  },
                }}
              >
                <PageLayoutContentProvider
                  value={{
                    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
                    tabId: 'fields',
                  }}
                >
                  <WidgetComponentInstanceContext.Provider
                    value={{ instanceId: widget.id }}
                  >
                    <FieldWidget widget={widget} />
                  </WidgetComponentInstanceContext.Provider>
                </PageLayoutContentProvider>
              </LayoutRenderingProvider>
            </PageLayoutTestWrapper>
          </CoreClientProviderWrapper>
        </JestMetadataAndApolloMocksWrapper>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(await canvas.findByText('5m')).toBeVisible();
  },
};

export const EmailsFieldWidget: Story = {
  render: () => {
    const widget: PageLayoutWidget = {
      __typename: 'PageLayoutWidget',
      applicationId: '',
      isActive: true,
      id: 'widget-emails-field',
      pageLayoutTabId: TAB_ID_OVERVIEW,
      type: WidgetType.FIELD,
      title: 'Surel',
      objectMetadataId: personObjectMetadataItem.id,
      gridPosition: {
        __typename: 'GridPosition',
        row: 7,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
      },
      configuration: {
        __typename: 'FieldConfiguration',
        configurationType: WidgetConfigurationType.FIELD,
        fieldMetadataId: personEmailsField.id,
        fieldDisplayMode: FieldDisplayMode.FIELD,
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
    jotaiStore.set(isMinimalMetadataReadyState.atom, true);
    const pageLayoutData = createPageLayoutWithWidget(
      widget,
      personObjectMetadataItem.id,
    );
    jotaiStore.set(
      pageLayoutPersistedComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    jotaiStore.set(
      pageLayoutDraftComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    setRecordInStores(TEST_PERSON_RECORD_ID, mockPersonRecord);

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <JestMetadataAndApolloMocksWrapper>
          <CoreClientProviderWrapper>
            <PageLayoutTestWrapper store={jotaiStore}>
              <LayoutRenderingProvider
                value={{
                  isInSidePanel: false,
                  layoutType: PageLayoutType.RECORD_PAGE,
                  targetRecordIdentifier: {
                    id: TEST_PERSON_RECORD_ID,
                    targetObjectNameSingular:
                      personObjectMetadataItem.nameSingular,
                  },
                }}
              >
                <PageLayoutContentProvider
                  value={{
                    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
                    tabId: 'fields',
                  }}
                >
                  <WidgetComponentInstanceContext.Provider
                    value={{ instanceId: widget.id }}
                  >
                    <FieldWidget widget={widget} />
                  </WidgetComponentInstanceContext.Provider>
                </PageLayoutContentProvider>
              </LayoutRenderingProvider>
            </PageLayoutTestWrapper>
          </CoreClientProviderWrapper>
        </JestMetadataAndApolloMocksWrapper>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const email = await canvas.findByText(/jane\.smith@acme\.com/);
    expect(email).toBeVisible();
  },
};

export const PhonesFieldWidget: Story = {
  render: () => {
    const widget: PageLayoutWidget = {
      __typename: 'PageLayoutWidget',
      applicationId: '',
      isActive: true,
      id: 'widget-phones-field',
      pageLayoutTabId: TAB_ID_OVERVIEW,
      type: WidgetType.FIELD,
      title: 'Nomor Telepon',
      objectMetadataId: personObjectMetadataItem.id,
      gridPosition: {
        __typename: 'GridPosition',
        row: 8,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
      },
      configuration: {
        __typename: 'FieldConfiguration',
        configurationType: WidgetConfigurationType.FIELD,
        fieldMetadataId: personPhonesField.id,
        fieldDisplayMode: FieldDisplayMode.FIELD,
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
    jotaiStore.set(isMinimalMetadataReadyState.atom, true);
    const pageLayoutData = createPageLayoutWithWidget(
      widget,
      personObjectMetadataItem.id,
    );
    jotaiStore.set(
      pageLayoutPersistedComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    jotaiStore.set(
      pageLayoutDraftComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    setRecordInStores(TEST_PERSON_RECORD_ID, mockPersonRecord);

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <JestMetadataAndApolloMocksWrapper>
          <CoreClientProviderWrapper>
            <PageLayoutTestWrapper store={jotaiStore}>
              <LayoutRenderingProvider
                value={{
                  isInSidePanel: false,
                  layoutType: PageLayoutType.RECORD_PAGE,
                  targetRecordIdentifier: {
                    id: TEST_PERSON_RECORD_ID,
                    targetObjectNameSingular:
                      personObjectMetadataItem.nameSingular,
                  },
                }}
              >
                <PageLayoutContentProvider
                  value={{
                    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
                    tabId: 'fields',
                  }}
                >
                  <WidgetComponentInstanceContext.Provider
                    value={{ instanceId: widget.id }}
                  >
                    <FieldWidget widget={widget} />
                  </WidgetComponentInstanceContext.Provider>
                </PageLayoutContentProvider>
              </LayoutRenderingProvider>
            </PageLayoutTestWrapper>
          </CoreClientProviderWrapper>
        </JestMetadataAndApolloMocksWrapper>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const phone = await canvas.findByText(/555/);
    expect(phone).toBeVisible();
  },
};

export const SelectFieldWidget: Story = {
  render: () => {
    const widget: PageLayoutWidget = {
      __typename: 'PageLayoutWidget',
      applicationId: '',
      isActive: true,
      id: 'widget-select-field',
      pageLayoutTabId: TAB_ID_OVERVIEW,
      type: WidgetType.FIELD,
      title: 'Tahap',
      objectMetadataId: opportunityObjectMetadataItem.id,
      gridPosition: {
        __typename: 'GridPosition',
        row: 9,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
      },
      configuration: {
        __typename: 'FieldConfiguration',
        configurationType: WidgetConfigurationType.FIELD,
        fieldMetadataId: opportunityStageField.id,
        fieldDisplayMode: FieldDisplayMode.FIELD,
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
    jotaiStore.set(isMinimalMetadataReadyState.atom, true);
    const pageLayoutData = createPageLayoutWithWidget(
      widget,
      opportunityObjectMetadataItem.id,
    );
    jotaiStore.set(
      pageLayoutPersistedComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    jotaiStore.set(
      pageLayoutDraftComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    setRecordInStores(TEST_OPPORTUNITY_RECORD_ID, mockOpportunityRecord);

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <JestMetadataAndApolloMocksWrapper>
          <CoreClientProviderWrapper>
            <PageLayoutTestWrapper store={jotaiStore}>
              <LayoutRenderingProvider
                value={{
                  isInSidePanel: false,
                  layoutType: PageLayoutType.RECORD_PAGE,
                  targetRecordIdentifier: {
                    id: TEST_OPPORTUNITY_RECORD_ID,
                    targetObjectNameSingular:
                      opportunityObjectMetadataItem.nameSingular,
                  },
                }}
              >
                <PageLayoutContentProvider
                  value={{
                    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
                    tabId: 'fields',
                  }}
                >
                  <WidgetComponentInstanceContext.Provider
                    value={{ instanceId: widget.id }}
                  >
                    <FieldWidget widget={widget} />
                  </WidgetComponentInstanceContext.Provider>
                </PageLayoutContentProvider>
              </LayoutRenderingProvider>
            </PageLayoutTestWrapper>
          </CoreClientProviderWrapper>
        </JestMetadataAndApolloMocksWrapper>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Select field displays the selected option label
    const stage = await canvas.findByText(/Proposal/);
    expect(stage).toBeVisible();
  },
};

export const MultiSelectFieldWidget: Story = {
  render: () => {
    const widget: PageLayoutWidget = {
      __typename: 'PageLayoutWidget',
      applicationId: '',
      isActive: true,
      id: 'widget-multi-select-field',
      pageLayoutTabId: TAB_ID_OVERVIEW,
      type: WidgetType.FIELD,
      title: 'Kebijakan Kerja',
      objectMetadataId: companyObjectMetadataItem.id,
      gridPosition: {
        __typename: 'GridPosition',
        row: 10,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
      },
      configuration: {
        __typename: 'FieldConfiguration',
        configurationType: WidgetConfigurationType.FIELD,
        fieldMetadataId: companyWorkPolicyField.id,
        fieldDisplayMode: FieldDisplayMode.FIELD,
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
    jotaiStore.set(isMinimalMetadataReadyState.atom, true);
    const pageLayoutData = createPageLayoutWithWidget(
      widget,
      companyObjectMetadataItem.id,
    );
    jotaiStore.set(
      pageLayoutPersistedComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    jotaiStore.set(
      pageLayoutDraftComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    setRecordInStores(TEST_RECORD_ID, mockCompanyRecord);

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <JestMetadataAndApolloMocksWrapper>
          <CoreClientProviderWrapper>
            <PageLayoutTestWrapper store={jotaiStore}>
              <LayoutRenderingProvider
                value={{
                  isInSidePanel: false,
                  layoutType: PageLayoutType.RECORD_PAGE,
                  targetRecordIdentifier: {
                    id: TEST_RECORD_ID,
                    targetObjectNameSingular:
                      companyObjectMetadataItem.nameSingular,
                  },
                }}
              >
                <PageLayoutContentProvider
                  value={{
                    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
                    tabId: 'fields',
                  }}
                >
                  <WidgetComponentInstanceContext.Provider
                    value={{ instanceId: widget.id }}
                  >
                    <FieldWidget widget={widget} />
                  </WidgetComponentInstanceContext.Provider>
                </PageLayoutContentProvider>
              </LayoutRenderingProvider>
            </PageLayoutTestWrapper>
          </CoreClientProviderWrapper>
        </JestMetadataAndApolloMocksWrapper>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Multi-select displays multiple chips
    const onSiteChip = await canvas.findByText(/On-Site/);
    expect(onSiteChip).toBeVisible();

    const hybridChip = await canvas.findByText(/Hybrid/);
    expect(hybridChip).toBeVisible();
  },
};

export const TimelineActivityRelationFieldWidget: Story = {
  render: () => {
    const widget: PageLayoutWidget = {
      __typename: 'PageLayoutWidget',
      applicationId: '',
      isActive: true,
      id: 'widget-timeline-activity-relation-field',
      pageLayoutTabId: TAB_ID_OVERVIEW,
      type: WidgetType.FIELD,
      title: 'Anggota Tim',
      objectMetadataId: timelineActivityObjectMetadataItem.id,
      gridPosition: {
        __typename: 'GridPosition',
        row: 12,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
      },
      configuration: {
        __typename: 'FieldConfiguration',
        configurationType: WidgetConfigurationType.FIELD,
        fieldMetadataId: timelineActivityWorkspaceMemberField.id,
        fieldDisplayMode: FieldDisplayMode.FIELD,
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
    jotaiStore.set(isMinimalMetadataReadyState.atom, true);
    const pageLayoutData = createPageLayoutWithWidget(
      widget,
      timelineActivityObjectMetadataItem.id,
    );
    jotaiStore.set(
      pageLayoutPersistedComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    jotaiStore.set(
      pageLayoutDraftComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    setRecordInStores(
      TEST_TIMELINE_ACTIVITY_RECORD_ID,
      mockTimelineActivityRecord,
    );
    // Set the related WorkspaceMember record for TimelineActivity relation display
    setRecordInStores('test-workspace-member-xyz', mockWorkspaceMemberRecord);

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <JestMetadataAndApolloMocksWrapper>
          <CoreClientProviderWrapper>
            <PageLayoutTestWrapper store={jotaiStore}>
              <LayoutRenderingProvider
                value={{
                  isInSidePanel: false,
                  layoutType: PageLayoutType.RECORD_PAGE,
                  targetRecordIdentifier: {
                    id: TEST_TIMELINE_ACTIVITY_RECORD_ID,
                    targetObjectNameSingular:
                      timelineActivityObjectMetadataItem.nameSingular,
                  },
                }}
              >
                <PageLayoutContentProvider
                  value={{
                    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
                    tabId: 'fields',
                  }}
                >
                  <WidgetComponentInstanceContext.Provider
                    value={{ instanceId: widget.id }}
                  >
                    <FieldWidget widget={widget} />
                  </WidgetComponentInstanceContext.Provider>
                </PageLayoutContentProvider>
              </LayoutRenderingProvider>
            </PageLayoutTestWrapper>
          </CoreClientProviderWrapper>
        </JestMetadataAndApolloMocksWrapper>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const workspaceMemberChip = await canvas.findByText('Sari Jaya');
    expect(workspaceMemberChip).toBeVisible();
  },
};

export const ManyToOneRelationCardWidget: Story = {
  render: () => {
    const widget: PageLayoutWidget = {
      __typename: 'PageLayoutWidget',
      applicationId: '',
      isActive: true,
      id: 'widget-relation-card',
      pageLayoutTabId: TAB_ID_OVERVIEW,
      type: WidgetType.FIELD,
      title: 'Pengelola Akun',
      objectMetadataId: companyObjectMetadataItem.id,
      gridPosition: {
        __typename: 'GridPosition',
        row: 4,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
      },
      configuration: {
        __typename: 'FieldConfiguration',
        configurationType: WidgetConfigurationType.FIELD,
        fieldMetadataId: accountOwnerField.id,
        fieldDisplayMode: FieldDisplayMode.CARD,
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
    jotaiStore.set(isMinimalMetadataReadyState.atom, true);
    const pageLayoutData = createPageLayoutWithWidget(
      widget,
      companyObjectMetadataItem.id,
    );
    jotaiStore.set(
      pageLayoutPersistedComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    jotaiStore.set(
      pageLayoutDraftComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    setRecordInStores(TEST_RECORD_ID, mockCompanyRecord);
    if (
      mockCompanyRecord.accountOwner !== null &&
      mockCompanyRecord.accountOwner !== undefined
    ) {
      setRecordInStores(
        mockCompanyRecord.accountOwner.id,
        mockCompanyRecord.accountOwner,
      );
    }

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <JestMetadataAndApolloMocksWrapper>
          <CoreClientProviderWrapper>
            <PageLayoutTestWrapper store={jotaiStore}>
              <LayoutRenderingProvider
                value={{
                  isInSidePanel: false,
                  layoutType: PageLayoutType.RECORD_PAGE,
                  targetRecordIdentifier: {
                    id: TEST_RECORD_ID,
                    targetObjectNameSingular:
                      companyObjectMetadataItem.nameSingular,
                  },
                }}
              >
                <PageLayoutContentProvider
                  value={{
                    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
                    tabId: 'fields',
                  }}
                >
                  <WidgetComponentInstanceContext.Provider
                    value={{ instanceId: widget.id }}
                  >
                    <FieldWidget widget={widget} />
                  </WidgetComponentInstanceContext.Provider>
                </PageLayoutContentProvider>
              </LayoutRenderingProvider>
            </PageLayoutTestWrapper>
          </CoreClientProviderWrapper>
        </JestMetadataAndApolloMocksWrapper>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const accountOwnerChip = await canvas.findByText('Budi Saputra');
    expect(accountOwnerChip).toBeVisible();

    const expandButton = await canvas.findByTestId('expand-button');
    await userEvent.click(expandButton);

    const lastUpdateField = await canvas.findByText('Pembaruan Terakhir');

    await waitFor(() => {
      expect(lastUpdateField).toBeVisible();
    });
  },
};

export const OneToManyRelationCardWidget: Story = {
  render: () => {
    const widget: PageLayoutWidget = {
      __typename: 'PageLayoutWidget',
      applicationId: '',
      isActive: true,
      id: 'widget-one-to-many-relation-card',
      pageLayoutTabId: TAB_ID_OVERVIEW,
      type: WidgetType.FIELD,
      title: 'Daftar Anggota',
      objectMetadataId: companyObjectMetadataItem.id,
      gridPosition: {
        __typename: 'GridPosition',
        row: 11,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
      },
      configuration: {
        __typename: 'FieldConfiguration',
        configurationType: WidgetConfigurationType.FIELD,
        fieldMetadataId: companyPeopleField.id,
        fieldDisplayMode: FieldDisplayMode.CARD,
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
    jotaiStore.set(isMinimalMetadataReadyState.atom, true);
    const pageLayoutData = createPageLayoutWithWidget(
      widget,
      companyObjectMetadataItem.id,
    );
    jotaiStore.set(
      pageLayoutPersistedComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    jotaiStore.set(
      pageLayoutDraftComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    setRecordInStores(TEST_RECORD_ID, mockCompanyRecord);
    setRecordInStores(TEST_PERSON_RECORD_ID, mockPersonRecord);

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <JestMetadataAndApolloMocksWrapper>
          <CoreClientProviderWrapper>
            <PageLayoutTestWrapper store={jotaiStore}>
              <LayoutRenderingProvider
                value={{
                  isInSidePanel: false,
                  layoutType: PageLayoutType.RECORD_PAGE,
                  targetRecordIdentifier: {
                    id: TEST_RECORD_ID,
                    targetObjectNameSingular:
                      companyObjectMetadataItem.nameSingular,
                  },
                }}
              >
                <PageLayoutContentProvider
                  value={{
                    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
                    tabId: 'fields',
                  }}
                >
                  <WidgetComponentInstanceContext.Provider
                    value={{ instanceId: widget.id }}
                  >
                    <FieldWidget widget={widget} />
                  </WidgetComponentInstanceContext.Provider>
                </PageLayoutContentProvider>
              </LayoutRenderingProvider>
            </PageLayoutTestWrapper>
          </CoreClientProviderWrapper>
        </JestMetadataAndApolloMocksWrapper>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const personChip = await canvas.findByText('Siti Santoso');
    expect(personChip).toBeVisible();
  },
};

export const TimelineActivityRelationCardWidget: Story = {
  render: () => {
    const widget: PageLayoutWidget = {
      __typename: 'PageLayoutWidget',
      applicationId: '',
      isActive: true,
      id: 'widget-timeline-activity-relation-card',
      pageLayoutTabId: TAB_ID_OVERVIEW,
      type: WidgetType.FIELD,
      title: 'Anggota Tim',
      objectMetadataId: timelineActivityObjectMetadataItem.id,
      gridPosition: {
        __typename: 'GridPosition',
        row: 12,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
      },
      configuration: {
        __typename: 'FieldConfiguration',
        configurationType: WidgetConfigurationType.FIELD,
        fieldMetadataId: timelineActivityWorkspaceMemberField.id,
        fieldDisplayMode: FieldDisplayMode.CARD,
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
    jotaiStore.set(isMinimalMetadataReadyState.atom, true);
    const pageLayoutData = createPageLayoutWithWidget(
      widget,
      timelineActivityObjectMetadataItem.id,
    );
    jotaiStore.set(
      pageLayoutPersistedComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    jotaiStore.set(
      pageLayoutDraftComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    setRecordInStores(
      TEST_TIMELINE_ACTIVITY_RECORD_ID,
      mockTimelineActivityRecord,
    );
    setRecordInStores('test-workspace-member-xyz', mockWorkspaceMemberRecord);

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <JestMetadataAndApolloMocksWrapper>
          <CoreClientProviderWrapper>
            <PageLayoutTestWrapper store={jotaiStore}>
              <LayoutRenderingProvider
                value={{
                  isInSidePanel: false,
                  layoutType: PageLayoutType.RECORD_PAGE,
                  targetRecordIdentifier: {
                    id: TEST_TIMELINE_ACTIVITY_RECORD_ID,
                    targetObjectNameSingular:
                      timelineActivityObjectMetadataItem.nameSingular,
                  },
                }}
              >
                <PageLayoutContentProvider
                  value={{
                    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
                    tabId: 'fields',
                  }}
                >
                  <WidgetComponentInstanceContext.Provider
                    value={{ instanceId: widget.id }}
                  >
                    <FieldWidget widget={widget} />
                  </WidgetComponentInstanceContext.Provider>
                </PageLayoutContentProvider>
              </LayoutRenderingProvider>
            </PageLayoutTestWrapper>
          </CoreClientProviderWrapper>
        </JestMetadataAndApolloMocksWrapper>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const workspaceMemberChip = await canvas.findByText('Sari Jaya');
    expect(workspaceMemberChip).toBeVisible();

    const expandButton = await canvas.findByTestId('expand-button');
    await userEvent.click(expandButton);

    const lastUpdateField = await canvas.findByText('Pembaruan Terakhir');

    await waitFor(() => {
      expect(lastUpdateField).toBeVisible();
    });
  },
};

// Helper untuk membuat mock record penduduk pada test progressive loading
const generateMockPendudukRecords = (count: number) => {
  const names = [
    { firstName: 'Siti', lastName: 'Aminah' },
    { firstName: 'Budi', lastName: 'Santoso' },
    { firstName: 'Aisyah', lastName: 'Putri' },
    { firstName: 'Ahmad', lastName: 'Wijaya' },
    { firstName: 'Cahya', lastName: 'Lestari' },
    { firstName: 'Dimas', lastName: 'Pratama' },
    { firstName: 'Eka', lastName: 'Saputra' },
    { firstName: 'Fitri', lastName: 'Anggraini' },
    { firstName: 'Gita', lastName: 'Permata' },
    { firstName: 'Hadi', lastName: 'Tanudjaja' },
    { firstName: 'Ivy', lastName: 'Jayadi' },
    { firstName: 'Joko', lastName: 'Wibowo' },
  ];

  return Array.from({ length: count }, (_, index) => {
    const nameInfo = names[index % names.length];
    const recordId = `person-${index + 1}`;
    return {
      id: recordId,
      __typename: 'Penduduk',
      name: {
        __typename: 'FullName',
        firstName: nameInfo.firstName,
        lastName: `${nameInfo.lastName} ${index + 1}`,
      },
      emails: {
        __typename: 'Emails',
        primaryEmail: `${nameInfo.firstName.toLowerCase()}.${nameInfo.lastName.toLowerCase()}${index + 1}@example.com`,
        additionalEmails: [],
      },
      phones: {
        __typename: 'Phones',
        primaryPhoneNumber: `555000${(index + 1).toString().padStart(4, '0')}`,
        primaryPhoneCountryCode: '+1',
        primaryPhoneCallingCode: '+1',
        additionalPhones: [],
      },
    };
  });
};

export const OneToManyRelationCardWidgetWithProgressiveLoading: Story = {
  render: () => {
    const mockDaftarPenduduk = generateMockPendudukRecords(12);
    const companyWithManyPeople = {
      ...mockCompanyRecord,
      people: mockDaftarPenduduk.map(({ id, __typename, name }) => ({
        __typename,
        id,
        name,
      })),
    };

    const widget: PageLayoutWidget = {
      __typename: 'PageLayoutWidget',
      applicationId: '',
      isActive: true,
      id: 'widget-one-to-many-relation-card-progressive',
      pageLayoutTabId: TAB_ID_OVERVIEW,
      type: WidgetType.FIELD,
      title: 'Daftar Anggota',
      objectMetadataId: companyObjectMetadataItem.id,
      gridPosition: {
        __typename: 'GridPosition',
        row: 11,
        column: 0,
        rowSpan: 1,
        columnSpan: 2,
      },
      configuration: {
        __typename: 'FieldConfiguration',
        configurationType: WidgetConfigurationType.FIELD,
        fieldMetadataId: companyPeopleField.id,
        fieldDisplayMode: FieldDisplayMode.CARD,
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      deletedAt: null,
    };

    setTestObjectMetadataItemsInMetadataStore(
      jotaiStore,
      getTestEnrichedObjectMetadataItemsMock(),
    );
    jotaiStore.set(isMinimalMetadataReadyState.atom, true);
    const pageLayoutData = createPageLayoutWithWidget(
      widget,
      companyObjectMetadataItem.id,
    );
    jotaiStore.set(
      pageLayoutPersistedComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    jotaiStore.set(
      pageLayoutDraftComponentState.atomFamily({
        instanceId: PAGE_LAYOUT_TEST_INSTANCE_ID,
      }),
      pageLayoutData,
    );
    setRecordInStores(TEST_RECORD_ID, companyWithManyPeople);
    // Set tiap record penduduk di store
    mockDaftarPenduduk.forEach((person) => {
      setRecordInStores(person.id, person);
    });

    return (
      <div style={{ width: '400px', padding: '20px' }}>
        <JestMetadataAndApolloMocksWrapper>
          <CoreClientProviderWrapper>
            <PageLayoutTestWrapper store={jotaiStore}>
              <LayoutRenderingProvider
                value={{
                  isInSidePanel: false,
                  layoutType: PageLayoutType.RECORD_PAGE,
                  targetRecordIdentifier: {
                    id: TEST_RECORD_ID,
                    targetObjectNameSingular:
                      companyObjectMetadataItem.nameSingular,
                  },
                }}
              >
                <PageLayoutContentProvider
                  value={{
                    layoutMode: PageLayoutTabLayoutMode.VERTICAL_LIST,
                    tabId: 'fields',
                  }}
                >
                  <WidgetComponentInstanceContext.Provider
                    value={{ instanceId: widget.id }}
                  >
                    <FieldWidget widget={widget} />
                  </WidgetComponentInstanceContext.Provider>
                </PageLayoutContentProvider>
              </LayoutRenderingProvider>
            </PageLayoutTestWrapper>
          </CoreClientProviderWrapper>
        </JestMetadataAndApolloMocksWrapper>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Verifikasi tampilan awal - menampilkan 5 item pertama
    const firstPerson = await canvas.findByText('Siti Aminah 1');
    expect(firstPerson).toBeVisible();

    const fifthPerson = await canvas.findByText('Cahya Lestari 5');
    expect(fifthPerson).toBeVisible();

    // Verifikasi penduduk ke-6 TIDAK terlihat di awal
    expect(canvas.queryByText('Dimas Pratama 6')).not.toBeInTheDocument();

    // Verifikasi tombol "Selengkapnya (7)" visible (12 total - 5 shown = 7 remaining)
    const moreButton = await canvas.findByTestId(
      'field-widget-show-more-button',
    );
    expect(moreButton).toBeVisible();

    // Klik tombol "Selengkapnya" untuk memuat 5 item lagi
    await userEvent.click(moreButton);

    // Verifikasi item tambahan terlihat
    await waitFor(() => {
      const sixthPerson = canvas.getByText('Dimas Pratama 6');
      expect(sixthPerson).toBeVisible();
    });

    const tenthPerson = await canvas.findByText('Joko Wibowo 10');
    expect(tenthPerson).toBeVisible();

    // Verifikasi tombol "Selengkapnya (2)" visible (12 total - 10 shown = 2 remaining)
    const updatedMoreButton = await canvas.findByTestId(
      'field-widget-show-more-button',
    );

    // Klik tombol "Selengkapnya" lagi untuk memuat sisa item
    await userEvent.click(updatedMoreButton);

    // Verifikasi semua item sudah terlihat
    await waitFor(() => {
      const twelfthPerson = canvas.getByText('Fitri Anggraini 12');
      expect(twelfthPerson).toBeVisible();
    });

    // Verifikasi tombol "Selengkapnya" sudah tidak visible
    expect(
      canvas.queryByTestId('field-widget-show-more-button'),
    ).not.toBeInTheDocument();
  },
};
