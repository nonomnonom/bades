import { msg } from '@lingui/core/macro';

import type { FeatureTileType } from '@/sections/Feature';
import { ContactsVisual } from '@/sections/Feature/visuals/ContactsVisual';
import { DashboardVisual } from '@/sections/Feature/visuals/DashboardVisual';
import { EmailsVisual } from '@/sections/Feature/visuals/EmailsVisual';
import { FilesVisual } from '@/sections/Feature/visuals/FilesVisual';
import { ImportVisual } from '@/sections/Feature/visuals/ImportVisual';
import { PipelineVisual } from '@/sections/Feature/visuals/PipelineVisual';
import { TasksVisual } from '@/sections/Feature/visuals/TasksVisual';

export const FEATURE_TILES: FeatureTileType[] = [
  {
    category: msg`Reports & Dashboards`,
    heading: msg`Metrics you can actually trust.`,
    description: msg`Build custom dashboards from live village data. Aggregate anything — residents, services, activity — into charts your team actually reads.`,
    visual: DashboardVisual,
    bullets: [
      {
        icon: 'check',
        text: msg`Aggregate, bar, line, pie, and gauge widgets`,
      },
      { icon: 'search', text: msg`Filtered metrics from any object` },
      { icon: 'check', text: msg`Real-time data` },
    ],
  },
  {
    category: msg`Tasks & Activities`,
    heading: msg`Context lives with the record.`,
    description: msg`Create tasks, assign owners, and attach rich notes directly from any record. No tab-switching, no lost context.`,
    visual: TasksVisual,
    bullets: [
      { icon: 'check', text: msg`Create tasks from records` },
      { icon: 'users', text: msg`Assign owners and due dates` },
      { icon: 'edit', text: msg`Rich notes attached to records` },
    ],
  },
  {
    category: msg`Email & Calendar`,
    heading: msg`Every thread, on the right record.`,
    description: msg`Connect Google or Microsoft accounts and see emails and events linked to village records automatically.`,
    visual: EmailsVisual,
    bullets: [
      { icon: 'check', text: msg`Connect Google or Microsoft accounts` },
      {
        icon: 'search',
        text: msg`Emails and events linked to village records`,
      },
      { icon: 'book', text: msg`Full communication history in one place` },
    ],
  },
  {
    category: msg`Residents & Households`,
    heading: msg`Your network, fully mapped.`,
    description: msg`Custom fields, relationships, and a unified timeline for every resident and household in your village.`,
    visual: ContactsVisual,
    bullets: [
      { icon: 'edit', text: msg`Custom fields and relationships` },
      {
        icon: 'book',
        text: msg`Unified timeline (emails, events, tasks, notes, files)`,
      },
      {
        icon: 'search',
        text: msg`Email/calendar activity on each record`,
      },
    ],
  },
  {
    category: msg`Service Pipeline`,
    heading: msg`Services that move themselves.`,
    description: msg`Custom service stages, drag-and-drop boards, and real-time tracking so your pipeline reflects village reality.`,
    visual: PipelineVisual,
    bullets: [
      { icon: 'edit', text: msg`Custom service stages for your process` },
      { icon: 'check', text: msg`Drag-and-drop services between stages` },
      { icon: 'tag', text: msg`Track requests and completion date` },
    ],
  },
  {
    category: msg`Files`,
    heading: msg`Attachments without the chaos.`,
    description: msg`Upload, rename, preview, and manage files directly on records. Everything stays where it belongs.`,
    visual: FilesVisual,
    bullets: [
      { icon: 'check', text: msg`Multi-file upload on records` },
      { icon: 'edit', text: msg`Rename, download, and delete attachments` },
      {
        icon: 'eye',
        text: msg`In-app preview for supported file types (when enabled)`,
      },
    ],
  },
  {
    category: msg`Data import`,
    heading: msg`From CSV to Village Records in minutes.`,
    description: msg`Import your data with field mapping, including relations. Export anytime — your data is always yours.`,
    visual: ImportVisual,
    bullets: [
      { icon: 'check', text: msg`CSV import flow` },
      {
        icon: 'code',
        text: msg`Column-to-field mapping (including relations)`,
      },
      { icon: 'check', text: msg`CSV export anytime` },
    ],
  },
];
