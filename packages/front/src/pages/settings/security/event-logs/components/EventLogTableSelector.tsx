import { useLingui } from '@lingui/react/macro';

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
      label: ""Page Views",
    },
    {
      value: EventLogTable.WORKSPACE_EVENT,
      label: ""Workspace Events",
    },
    {
      value: EventLogTable.OBJECT_EVENT,
      label: ""Object Events",
    },
    {
      value: EventLogTable.USAGE_EVENT,
      label: ""Usage Events",
    },
    {
      value: EventLogTable.APPLICATION_LOG,
      label: ""Application Logs",
    },
  ];

  return (
    <Select
      dropdownId="event-log-table-selector"
      label={"Tabel"}
      fullWidth
      value={value}
      options={options}
      onChange={onChange}
    />
  );
};
