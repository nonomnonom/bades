import { flattenedFieldMetadataItemsSelector } from '@/object-metadata/states/flattenedFieldMetadataItemsSelector';
import { objectMetadataItemsSelector } from '@/object-metadata/states/objectMetadataItemsSelector';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
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
          label: `Identifier universal`,
          value: view.universalIdentifier,
        },
        { key: 'type', label: `Tipe`, value: view.type ?? `Tabel` },
        {
          key: 'object',
          label: `Objek`,
          value: objectLabel ?? view.objectUniversalIdentifier,
        },
        { key: 'icon', label: `Ikon`, value: view.icon ?? `Belum diatur` },
        {
          key: 'visibility',
          label: `Visibilitas`,
          value: view.visibility ?? `Bawaan`,
        },
        {
          key: 'openRecordIn',
          label: `Buka catatan di`,
          value: view.openRecordIn ?? `Bawaan`,
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
      entityName={view?.name ?? `Tampilan`}
      entityTypeLabel={`tampilan`}
      categoryLabel={`Tampilan`}
      detailRows={detailRows}
      isLoading={isLoading}
    >
      <SettingsLayoutItemTable
        title={`Kolom`}
        description={`Kolom yang ditampilkan dalam tampilan ini, sesuai urutan tampil`}
        columns={[
          { key: 'position', label: `#`, width: '40px', align: 'right' },
          { key: 'field', label: `Kolom` },
          { key: 'visible', label: `Terlihat`, width: '80px' },
          { key: 'size', label: `Ukuran`, width: '80px', align: 'right' },
        ]}
        rows={sortedFields.map((field) => ({
          key: field.universalIdentifier,
          cells: [
            field.position,
            resolveFieldLabel(field.fieldMetadataUniversalIdentifier),
            field.isVisible === false ? `Tersembunyi` : `Ya`,
            field.size ?? '—',
          ],
        }))}
      />
      <SettingsLayoutItemTable
        title={`Filter`}
        description={`Kondisi yang diterapkan pada catatan sebelum muncul di tampilan ini`}
        columns={[
          { key: 'field', label: `Kolom` },
          { key: 'operand', label: `Operan`, width: '160px' },
          { key: 'value', label: `Nilai` },
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
        title={`Urutan`}
        description={`Urutan tampil catatan`}
        columns={[
          { key: 'field', label: `Kolom` },
          { key: 'direction', label: `Arah`, width: '120px' },
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
