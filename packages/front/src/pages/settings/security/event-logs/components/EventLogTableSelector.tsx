
import { useLingui } from '~/utils/i18n/badesI18n';
import { Select } from '@/ui/input/components/Select';
import { EventLogTable } from '~/generated-metadata/graphql';

type EventLogTableSelectorProps = {
  value: EventLogTable;
  onChange: (value: EventLogTable) => void;
};

export const EventLogTableSelector = ({
  value,
  onChange,
}: EventLogTableSelectorProps) => {
  const { t } = useLingui();

  const options = [
    {
      value: EventLogTable.PAGEVIEW,
      label: t`Tampilan Halaman`,
    },
    {
      value: EventLogTable.WORKSPACE_EVENT,
      label: t`Peristiwa Ruang Kerja`,
    },
    {
      value: EventLogTable.OBJECT_EVENT,
      label: t`Peristiwa Objek`,
    },
    {
      value: EventLogTable.USAGE_EVENT,
      label: t`Peristiwa Penggunaan`,
    },
    {
      value: EventLogTable.APPLICATION_LOG,
      label: t`Log Aplikasi`,
    },
  ];

  return (
    <Select
      dropdownId="event-log-table-selector"
      label={t`Tabel`}
      fullWidth
      value={value}
      options={options}
      onChange={onChange}
    />
  );
};
