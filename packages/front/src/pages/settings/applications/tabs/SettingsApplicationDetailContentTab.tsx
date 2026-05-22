import { useLingui } from '~/utils/i18n/badesI18n';
import { getLogicFunctionTriggerLabel } from '@/logic-functions/utils/getLogicFunctionTriggerLabel';
import { useComputeApplicationContentForLayoutAndLogic } from '@/settings/applications/hooks/useComputeApplicationContentForLayoutAndLogic';
import { useComputeObjectAndFieldsContentForApplication } from '@/settings/applications/hooks/useComputeObjectAndFieldsContentForApplication';
import { Table } from '@/ui/layout/table/components/Table';
import { useState } from 'react';
import { type Manifest } from 'shared/application';
import { SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined } from 'shared/utils';
import { H2Title } from 'ui/display';
import { SearchInput } from 'ui/input';
import { Section } from 'ui/layout';
import { type ApplicationDisplayData } from '@/applications/types/applicationDisplayData.type';
import { type Application } from '~/generated-metadata/graphql';
import {
  type ApplicationContentRow,
  SettingsApplicationContentSubtable,
} from '~/pages/settings/applications/components/SettingsApplicationContentSubtable';
import { normalizeSearchText } from '~/utils/normalizeSearchText';

type InstalledApplicationForContentTab = Omit<
  Application,
  'objects' | 'frontComponents' | 'commandMenuItems'
> & {
  objects: { id: string }[];
  frontComponents?: {
    id: string;
    name: string;
    description?: string | null;
  }[];
  commandMenuItems?: {
    id: string;
    label: string;
    shortLabel?: string | null;
  }[];
};

type SettingsApplicationDetailContentTabProps = {
  applicationId: string;
  installedApplication?: InstalledApplicationForContentTab;
  manifestContent?: Manifest;
  applicationInfo: ApplicationDisplayData;
};

const filterRows = (rows: ApplicationContentRow[], normalizedSearch: string) =>
  normalizedSearch === ''
    ? rows
    : rows.filter(
        (row) =>
          normalizeSearchText(row.name).includes(normalizedSearch) ||
          (isDefined(row.secondary) &&
            normalizeSearchText(row.secondary).includes(normalizedSearch)),
      );

export const SettingsApplicationDetailContentTab = ({
  applicationId,
  installedApplication,
  manifestContent,
  applicationInfo,
}: SettingsApplicationDetailContentTabProps) => {
  const { t } = useLingui();

  const { objectRows, fieldRows } =
    useComputeObjectAndFieldsContentForApplication({
      installedApplication,
      manifestContent,
    });

  const {
    pageLayoutRows,
    viewRows,
    navigationMenuItemRows,
    agentRows,
    skillRows,
    roleRows,
    connectionProviderRows,
  } = useComputeApplicationContentForLayoutAndLogic({
    installedApplication,
    manifestContent,
  });

  const fallbackApplicationData = {
    logo: applicationInfo?.logo,
    name: applicationInfo?.name,
  };

  const lifecycleOptions = {
    postInstallUniversalIdentifier:
      manifestContent?.application?.postInstallLogicFunction
        ?.universalIdentifier,
    preInstallUniversalIdentifier:
      manifestContent?.application?.preInstallLogicFunction
        ?.universalIdentifier,
  };

  const logicFunctionRows: ApplicationContentRow[] = isDefined(
    installedApplication,
  )
    ? (installedApplication.logicFunctions ?? []).map((lf) => ({
        key: lf.id,
        name: lf.name,
        secondary: getLogicFunctionTriggerLabel(lf, lifecycleOptions),
        link: getSettingsPath(SettingsPath.ApplicationLogicFunctionDetail, {
          applicationId,
          logicFunctionId: lf.id,
        }),
      }))
    : (manifestContent?.logicFunctions ?? []).map((lf) => ({
        key: lf.universalIdentifier,
        name: lf.name ?? lf.universalIdentifier,
        secondary: getLogicFunctionTriggerLabel(lf, lifecycleOptions),
      }));

  const frontComponentRows: ApplicationContentRow[] = isDefined(
    installedApplication,
  )
    ? (installedApplication.frontComponents ?? []).map((fc) => ({
        key: fc.id,
        name: fc.name,
        secondary: fc.description ?? undefined,
        link: getSettingsPath(SettingsPath.ApplicationFrontComponentDetail, {
          applicationId,
          frontComponentId: fc.id,
        }),
      }))
    : (manifestContent?.frontComponents ?? []).map((fc) => ({
        key: fc.universalIdentifier,
        name: fc.name ?? fc.universalIdentifier,
        secondary: fc.description ?? undefined,
      }));

  const commandMenuItemRows: ApplicationContentRow[] = isDefined(
    installedApplication,
  )
    ? (installedApplication.commandMenuItems ?? []).map((item) => ({
        key: item.id,
        name: item.label,
        secondary: item.shortLabel ?? undefined,
        link: getSettingsPath(SettingsPath.ApplicationCommandMenuItemDetail, {
          applicationId,
          commandMenuItemId: item.id,
        }),
      }))
    : (manifestContent?.commandMenuItems ?? []).map((item) => ({
        key: item.universalIdentifier,
        name: item.label,
        secondary: item.shortLabel ?? undefined,
      }));

  const [searchTerm, setSearchTerm] = useState('');
  const normalizedSearch = normalizeSearchText(searchTerm);

  const filtered = {
    objects: filterRows(objectRows, normalizedSearch),
    fields: filterRows(fieldRows, normalizedSearch),
    pageLayouts: filterRows(pageLayoutRows, normalizedSearch),
    views: filterRows(viewRows, normalizedSearch),
    navigation: filterRows(navigationMenuItemRows, normalizedSearch),
    frontComponents: filterRows(frontComponentRows, normalizedSearch),
    commandMenuItems: filterRows(commandMenuItemRows, normalizedSearch),
    logicFunctions: filterRows(logicFunctionRows, normalizedSearch),
    agents: filterRows(agentRows, normalizedSearch),
    skills: filterRows(skillRows, normalizedSearch),
    roles: filterRows(roleRows, normalizedSearch),
    connectionProviders: filterRows(connectionProviderRows, normalizedSearch),
  };

  const hasData = filtered.objects.length > 0 || filtered.fields.length > 0;
  const hasLayout =
    filtered.pageLayouts.length > 0 ||
    filtered.views.length > 0 ||
    filtered.navigation.length > 0 ||
    filtered.frontComponents.length > 0 ||
    filtered.commandMenuItems.length > 0;
  const hasLogic =
    filtered.logicFunctions.length > 0 ||
    filtered.agents.length > 0 ||
    filtered.skills.length > 0 ||
    filtered.roles.length > 0 ||
    filtered.connectionProviders.length > 0;

  if (!hasData && !hasLayout && !hasLogic && normalizedSearch === '') {
    return null;
  }

  return (
    <>
      <Section>
        <SearchInput
          placeholder={t`Cari...`}
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </Section>

      {hasData && (
        <Section>
          <H2Title
            title={t`Data`}
            description={t`Skema yang dikontribusikan aplikasi ini ke ruang kerja Anda`}
          />
          <Table>
            <SettingsApplicationContentSubtable
              title={t`Objek`}
              rows={filtered.objects}
              applicationId={applicationId}
              fallbackApplicationData={fallbackApplicationData}
            />
            <SettingsApplicationContentSubtable
              title={t`Field yang ditambahkan ke objek lain`}
              rows={filtered.fields}
              applicationId={applicationId}
              fallbackApplicationData={fallbackApplicationData}
            />
          </Table>
        </Section>
      )}

      {hasLayout && (
        <Section>
          <H2Title
            title={t`Tampilan`}
            description={t`Cara catatan, halaman, dan navigasi ditampilkan`}
          />
          <Table>
            <SettingsApplicationContentSubtable
              title={t`Tata letak halaman`}
              rows={filtered.pageLayouts}
              applicationId={applicationId}
              fallbackApplicationData={fallbackApplicationData}
            />
            <SettingsApplicationContentSubtable
              title={t`Tampilan`}
              rows={filtered.views}
              applicationId={applicationId}
              fallbackApplicationData={fallbackApplicationData}
            />
            <SettingsApplicationContentSubtable
              title={t`Item menu navigasi`}
              rows={filtered.navigation}
              applicationId={applicationId}
              fallbackApplicationData={fallbackApplicationData}
            />
            <SettingsApplicationContentSubtable
              title={t`Komponen tampilan`}
              rows={filtered.frontComponents}
              applicationId={applicationId}
              fallbackApplicationData={fallbackApplicationData}
            />
            <SettingsApplicationContentSubtable
              title={t`Item menu perintah`}
              rows={filtered.commandMenuItems}
              applicationId={applicationId}
              fallbackApplicationData={fallbackApplicationData}
            />
          </Table>
        </Section>
      )}

      {hasLogic && (
        <Section>
          <H2Title
            title={t`Logika`}
            description={t`Otomasi, AI, dan akses yang disediakan aplikasi ini`}
          />
          <Table>
            <SettingsApplicationContentSubtable
              title={t`Fungsi logika`}
              rows={filtered.logicFunctions}
              applicationId={applicationId}
              fallbackApplicationData={fallbackApplicationData}
            />
            <SettingsApplicationContentSubtable
              title={t`Agen`}
              rows={filtered.agents}
              applicationId={applicationId}
              fallbackApplicationData={fallbackApplicationData}
            />
            <SettingsApplicationContentSubtable
              title={t`Keahlian`}
              rows={filtered.skills}
              applicationId={applicationId}
              fallbackApplicationData={fallbackApplicationData}
            />
            <SettingsApplicationContentSubtable
              title={t`Peran`}
              rows={filtered.roles}
              applicationId={applicationId}
              fallbackApplicationData={fallbackApplicationData}
            />
            <SettingsApplicationContentSubtable
              title={t`Penyedia koneksi`}
              rows={filtered.connectionProviders}
              applicationId={applicationId}
              fallbackApplicationData={fallbackApplicationData}
            />
          </Table>
        </Section>
      )}
    </>
  );
};
