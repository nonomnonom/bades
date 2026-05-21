import { flattenedFieldMetadataItemsSelector } from '@/object-metadata/states/flattenedFieldMetadataItemsSelector';
import { objectMetadataItemsSelector } from '@/object-metadata/states/objectMetadataItemsSelector';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { t } from '@lingui/core/macro';
import { useParams } from 'react-router-dom';
import { isDefined } from 'shared/utils';
import { useApplicationManifest } from '~/pages/settings/layout/hooks/useApplicationManifest';
import {
  type DetailRow,
  SettingsLayoutDetailScaffold,
} from '~/pages/settings/layout/components/SettingsLayoutDetailScaffold';
import { SettingsLayoutItemTable } from '~/pages/settings/layout/components/SettingsLayoutItemTable';

const formatFilterValue = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return JSON.stringify(value);
};

export const SettingsLayoutViewDetail = () => {
  const { applicationId = '', viewUniversalIdentifier = '' } = useParams<{
    applicationId: string;
    viewUniversalIdentifier: string;
  }>();

  const { application, manifest, isLoading } =
    useApplicationManifest(applicationId);

  const objectMetadataItems = useAtomStateValue(objectMetadataItemsSelector);
  const flattenedFieldMetadataItems = useAtomStateValue(
    flattenedFieldMetadataItemsSelector,
  );

  const view = manifest?.views?.find(
    (v) => v.universalIdentifier === viewUniversalIdentifier,
  );

  const objectLabel = isDefined(view)
    ? objectMetadataItems.find(
        (o) => o.universalIdentifier === view.objectUniversalIdentifier,
      )?.labelSingular
    : undefined;

  const resolveFieldLabel = (uid: string): string =>
    flattenedFieldMetadataItems.find((f) => f.universalIdentifier === uid)
      ?.label ?? uid;

  const detailRows: DetailRow[] = isDefined(view)
    ? [
        {
          key: 'universalIdentifier',
          label: ""Universal identifier",
          value: view.universalIdentifier,
        },
        { key: 'type', label: "Tipe", value: view.type ?? "Tabel" },
        {
          key: 'object',
          label: "Objek",
          value: objectLabel ?? view.objectUniversalIdentifier,
        },
        { key: 'icon', label: "Ikon", value: view.icon ?? ""Not set" },
        {
          key: 'visibility',
          label: "Visibilitas",
          value: view.visibility ?? "Bawaan",
        },
        {
          key: 'openRecordIn',
          label: ""Open records in",
          value: view.openRecordIn ?? "Bawaan",
        },
      ]
    : [];

  const sortedFields = [...(view?.fields ?? [])].sort(
    (a, b) => a.position - b.position,
  );

  return (
    <SettingsLayoutDetailScaffold
      applicationId={applicationId}
      applicationName={application?.name}
      entityName={view?.name ?? "Lihat"}
      entityTypeLabel={""view"}
      categoryLabel={""Views"}
      detailRows={detailRows}
      isLoading={isLoading}
    >
      <SettingsLayoutItemTable
        title={"Bidang-bidang"}
        description={""Columns shown in this view, in display order"}
        columns={[
          { key: 'position', label: t`#`, width: '40px', align: 'right' },
          { key: 'field', label: "Bidang" },
          { key: 'visible', label: "Terlihat", width: '80px' },
          { key: 'size', label: "Ukuran", width: '80px', align: 'right' },
        ]}
        rows={sortedFields.map((field) => ({
          key: field.universalIdentifier,
          cells: [
            field.position,
            resolveFieldLabel(field.fieldMetadataUniversalIdentifier),
            field.isVisible === false ? ""Hidden" : "Ya",
            field.size ?? '—',
          ],
        }))}
      />
      <SettingsLayoutItemTable
        title={"Filter-filter"}
        description={""Conditions applied to records before they appear in this view"}
        columns={[
          { key: 'field', label: "Bidang" },
          { key: 'operand', label: ""Operand", width: '160px' },
          { key: 'value', label: "Nilai" },
        ]}
        rows={(view?.filters ?? []).map((filter) => ({
          key: filter.universalIdentifier,
          cells: [
            resolveFieldLabel(filter.fieldMetadataUniversalIdentifier),
            filter.operand,
            formatFilterValue(filter.value),
          ],
        }))}
      />
      <SettingsLayoutItemTable
        title={""Sorts"}
        description={""Order in which records are displayed"}
        columns={[
          { key: 'field', label: "Bidang" },
          { key: 'direction', label: ""Direction", width: '120px' },
        ]}
        rows={(view?.sorts ?? []).map((sort) => ({
          key: sort.universalIdentifier,
          cells: [
            resolveFieldLabel(sort.fieldMetadataUniversalIdentifier),
            sort.direction,
          ],
        }))}
      />
    </SettingsLayoutDetailScaffold>
  );
};
