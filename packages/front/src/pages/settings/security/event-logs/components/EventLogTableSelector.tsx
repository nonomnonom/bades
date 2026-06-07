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
  const options = [
    {
      value: EventLogTable.PAGEVIEW,
      label: `Tampilan Halaman`,
    },
    {
      value: EventLogTable.WORKSPACE_EVENT,
      label: `Peristiwa Ruang Kerja`,
    },
    {
      value: EventLogTable.OBJECT_EVENT,
      label: `Peristiwa Objek`,
    },
    {
      value: EventLogTable.USAGE_EVENT,
      label: `Peristiwa Penggunaan`,
    },
    {
      value: EventLogTable.APPLICATION_LOG,
      label: `Log Aplikasi`,
    },
  ];

  return (
    <Select
      dropdownId="event-log-table-selector"
      label={`Tabel`}
      fullWidth
      value={value}
      options={options}
      onChange={onChange}
    />
  );
};
