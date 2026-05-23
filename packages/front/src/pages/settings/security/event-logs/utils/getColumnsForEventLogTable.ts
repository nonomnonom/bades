import { msg } from '~/utils/i18n/badesI18n';
import { EventLogTable } from '~/generated-metadata/graphql';

export type ColumnConfig = {
  id: string;
  label: string;
  minWidth: number;
  defaultWidth: number;
};

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: 'event', label: 'Event', minWidth: 100, defaultWidth: 200 },
  {
    id: 'timestamp',
    label: 'Timestamp',
    minWidth: 100,
    defaultWidth: 150,
  },
  { id: 'userId', label: 'Pengguna', minWidth: 100, defaultWidth: 150 },
  {
    id: 'properties',
    label: 'Properties',
    minWidth: 200,
    defaultWidth: 400,
  },
];

const OBJECT_EVENT_COLUMNS: ColumnConfig[] = [
  { id: 'event', label: 'Event', minWidth: 100, defaultWidth: 180 },
  {
    id: 'timestamp',
    label: 'Timestamp',
    minWidth: 100,
    defaultWidth: 130,
  },
  { id: 'userId', label: 'Pengguna', minWidth: 100, defaultWidth: 130 },
  {
    id: 'recordId',
    label: 'Record ID',
    minWidth: 100,
    defaultWidth: 130,
  },
  {
    id: 'objectMetadataId',
    label: 'Object ID',
    minWidth: 100,
    defaultWidth: 130,
  },
  {
    id: 'properties',
    label: 'Properties',
    minWidth: 150,
    defaultWidth: 300,
  },
];

const USAGE_EVENT_COLUMNS: ColumnConfig[] = [
  {
    id: 'event',
    label: 'Resource Type',
    minWidth: 100,
    defaultWidth: 130,
  },
  {
    id: 'timestamp',
    label: 'Timestamp',
    minWidth: 100,
    defaultWidth: 140,
  },
  { id: 'userId', label: 'Pengguna', minWidth: 100, defaultWidth: 130 },
  {
    id: 'properties',
    label: 'Detail',
    minWidth: 200,
    defaultWidth: 400,
  },
];

const APPLICATION_LOG_COLUMNS: ColumnConfig[] = [
  {
    id: 'event',
    label: 'Fungsi',
    minWidth: 100,
    defaultWidth: 160,
  },
  {
    id: 'timestamp',
    label: 'Timestamp',
    minWidth: 100,
    defaultWidth: 140,
  },
  { id: 'level', label: 'Tingkat', minWidth: 60, defaultWidth: 80 },
  {
    id: 'message',
    label: 'Pesan',
    minWidth: 200,
    defaultWidth: 400,
  },
  {
    id: 'executionId',
    label: 'Execution ID',
    minWidth: 100,
    defaultWidth: 140,
  },
];

const COLUMNS_BY_TABLE: Record<EventLogTable, ColumnConfig[]> = {
  [EventLogTable.OBJECT_EVENT]: OBJECT_EVENT_COLUMNS,
  [EventLogTable.USAGE_EVENT]: USAGE_EVENT_COLUMNS,
  [EventLogTable.APPLICATION_LOG]: APPLICATION_LOG_COLUMNS,
  [EventLogTable.WORKSPACE_EVENT]: DEFAULT_COLUMNS,
  [EventLogTable.PAGEVIEW]: DEFAULT_COLUMNS,
};

export const getColumnsForEventLogTable = (
  table: EventLogTable,
): ColumnConfig[] => {
  return COLUMNS_BY_TABLE[table] ?? DEFAULT_COLUMNS;
};
