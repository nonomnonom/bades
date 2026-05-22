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
          label: t`Identifier universal`,
          value: view.universalIdentifier,
        },
        { key: 'type', label: t`Tipe`, value: view.type ?? t`Tabel` },
        {
          key: 'object',
          label: t`Objek`,
          value: objectLabel ?? view.objectUniversalIdentifier,
        },
        { key: 'icon', label: t`Ikon`, value: view.icon ?? t`Belum diatur` },
        {
          key: 'visibility',
          label: t`Visibilitas`,
          value: view.visibility ?? t`Bawaan`,
        },
        {
          key: 'openRecordIn',
          label: t`Buka catatan di`,
          value: view.openRecordIn ?? t`Bawaan`,
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
      entityName={view?.name ?? t`Tampilan`}
      entityTypeLabel={t`tampilan`}
      categoryLabel={t`Tampilan`}
      detailRows={detailRows}
      isLoading={isLoading}
    >
      <SettingsLayoutItemTable
        title={t`Kolom`}
        description={t`Kolom yang ditampilkan dalam tampilan ini, sesuai urutan tampil`}
        columns={[
          { key: 'position', label: t`#`, width: '40px', align: 'right' },
          { key: 'field', label: t`Kolom` },
          { key: 'visible', label: t`Terlihat`, width: '80px' },
          { key: 'size', label: t`Ukuran`, width: '80px', align: 'right' },
        ]}
        rows={sortedFields.map((field) => ({
          key: field.universalIdentifier,
          cells: [
            field.position,
            resolveFieldLabel(field.fieldMetadataUniversalIdentifier),
            field.isVisible === false ? t`Tersembunyi` : t`Ya`,
            field.size ?? '—',
          ],
        }))}
      />
      <SettingsLayoutItemTable
        title={t`Filter`}
        description={t`Kondisi yang diterapkan pada catatan sebelum muncul di tampilan ini`}
        columns={[
          { key: 'field', label: t`Kolom` },
          { key: 'operand', label: t`Operan`, width: '160px' },
          { key: 'value', label: t`Nilai` },
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
        title={t`Urutan`}
        description={t`Urutan tampil catatan`}
        columns={[
          { key: 'field', label: t`Kolom` },
          { key: 'direction', label: t`Arah`, width: '120px' },
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
