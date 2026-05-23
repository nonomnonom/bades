import { msg } from 'src/utils/bades-i18n';
import { STANDARD_OBJECTS } from 'shared/metadata';

import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import { type AllStandardObjectName } from 'src/engine/workspace-manager/bades-standard-application/types/all-standard-object-name.type';
import { i18nLabel } from 'src/engine/workspace-manager/bades-standard-application/utils/i18n-label.util';
import {
  type CreateStandardObjectArgs,
  createStandardObjectFlatMetadata,
} from 'src/engine/workspace-manager/bades-standard-application/utils/object-metadata/create-standard-object-flat-metadata.util';

export const STANDARD_FLAT_OBJECT_METADATA_BUILDERS_BY_OBJECT_NAME = {
  attachment: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'attachment'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'attachment',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.attachment.universalIdentifier,
        nameSingular: 'attachment',
        namePlural: 'attachments',
        labelSingular: i18nLabel(msg`Lampiran`),
        labelPlural: i18nLabel(msg`Lampiran`),
        description: i18nLabel(msg`Berkas lampiran`),
        icon: 'IconFileImport',
        isSystem: true,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  blocklist: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'blocklist'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'blocklist',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.blocklist.universalIdentifier,
        nameSingular: 'blocklist',
        namePlural: 'blocklists',
        labelSingular: i18nLabel(msg`Daftar Blokir`),
        labelPlural: i18nLabel(msg`Daftar Blokir`),
        description: i18nLabel(msg`Daftar blokir kontak`),
        icon: 'IconForbid2',
        isSystem: true,
        labelIdentifierFieldMetadataName: 'handle',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  calendarChannelEventAssociation: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'calendarChannelEventAssociation'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'calendarChannelEventAssociation',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.calendarChannelEventAssociation.universalIdentifier,
        nameSingular: 'calendarChannelEventAssociation',
        namePlural: 'calendarChannelEventAssociations',
        labelSingular: i18nLabel(msg`Relasi Acara Kalender`),
        labelPlural: i18nLabel(msg`Relasi Acara Kalender`),
        description: i18nLabel(msg`Relasi antara saluran kalender dan acara`),
        icon: 'IconCalendar',
        isSystem: true,
        isAuditLogged: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  calendarChannel: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'calendarChannel'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'calendarChannel',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.calendarChannel.universalIdentifier,
        nameSingular: 'calendarChannel',
        namePlural: 'calendarChannels',
        labelSingular: i18nLabel(msg`Saluran Kalender`),
        labelPlural: i18nLabel(msg`Saluran Kalender`),
        description: i18nLabel(msg`Saluran kalender tersinkron`),
        icon: 'IconCalendar',
        isSystem: true,
        isAuditLogged: false,
        labelIdentifierFieldMetadataName: 'handle',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  calendarEventParticipant: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'calendarEventParticipant'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'calendarEventParticipant',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.calendarEventParticipant.universalIdentifier,
        nameSingular: 'calendarEventParticipant',
        namePlural: 'calendarEventParticipants',
        labelSingular: i18nLabel(msg`Peserta Acara Kalender`),
        labelPlural: i18nLabel(msg`Peserta Acara Kalender`),
        description: i18nLabel(msg`Peserta acara kalender`),
        icon: 'IconCalendar',
        isSystem: true,
        isAuditLogged: false,
        labelIdentifierFieldMetadataName: 'handle',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  calendarEvent: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'calendarEvent'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'calendarEvent',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.calendarEvent.universalIdentifier,
        nameSingular: 'calendarEvent',
        namePlural: 'calendarEvents',
        labelSingular: i18nLabel(msg`Acara Kalender`),
        labelPlural: i18nLabel(msg`Acara Kalender`),
        description: i18nLabel(msg`Acara pada kalender tersinkron`),
        icon: 'IconCalendar',
        isSystem: true,
        isAuditLogged: false,
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  company: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'company'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'company',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.company.universalIdentifier,
        nameSingular: 'company',
        namePlural: 'companies',
        labelSingular: i18nLabel(msg`Company`),
        labelPlural: i18nLabel(msg`Companies`),
        description: i18nLabel(msg`A company`),
        icon: 'IconBuildingSkyscraper',
        isSearchable: true,
        shortcut: 'C',
        duplicateCriteria: [['name'], ['domainNamePrimaryLinkUrl']],
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  connectedAccount: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'connectedAccount'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'connectedAccount',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.connectedAccount.universalIdentifier,
        nameSingular: 'connectedAccount',
        namePlural: 'connectedAccounts',
        labelSingular: i18nLabel(msg`Akun Terhubung`),
        labelPlural: i18nLabel(msg`Akun Terhubung`),
        description: i18nLabel(msg`Akun eksternal yang terhubung`),
        icon: 'IconAt',
        isSystem: true,
        labelIdentifierFieldMetadataName: 'handle',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  dashboard: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'dashboard'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'dashboard',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.dashboard.universalIdentifier,
        nameSingular: 'dashboard',
        namePlural: 'dashboards',
        labelSingular: i18nLabel(msg`Dasbor`),
        labelPlural: i18nLabel(msg`Dasbor`),
        description: i18nLabel(msg`Dasbor ringkasan data`),
        icon: 'IconLayoutDashboard',
        isSearchable: true,
        shortcut: 'D',
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  messageChannelMessageAssociation: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageChannelMessageAssociation'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageChannelMessageAssociation',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.messageChannelMessageAssociation.universalIdentifier,
        nameSingular: 'messageChannelMessageAssociation',
        namePlural: 'messageChannelMessageAssociations',
        labelSingular: i18nLabel(msg`Relasi Pesan Saluran`),
        labelPlural: i18nLabel(msg`Relasi Pesan Saluran`),
        description: i18nLabel(msg`Pesan tersinkron dengan saluran pesan`),
        icon: 'IconMessage',
        isSystem: true,
        isAuditLogged: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  messageChannel: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageChannel'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageChannel',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.messageChannel.universalIdentifier,
        nameSingular: 'messageChannel',
        namePlural: 'messageChannels',
        labelSingular: i18nLabel(msg`Saluran Pesan`),
        labelPlural: i18nLabel(msg`Saluran Pesan`),
        description: i18nLabel(msg`Saluran pesan tersinkron`),
        icon: 'IconMessage',
        isSystem: true,
        isAuditLogged: false,
        labelIdentifierFieldMetadataName: 'handle',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  messageFolder: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageFolder'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageFolder',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.messageFolder.universalIdentifier,
        nameSingular: 'messageFolder',
        namePlural: 'messageFolders',
        labelSingular: i18nLabel(msg`Folder Pesan`),
        labelPlural: i18nLabel(msg`Folder Pesan`),
        description: i18nLabel(msg`Folder pesan`),
        icon: 'IconFolder',
        isSystem: true,
        isAuditLogged: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  messageChannelMessageAssociationMessageFolder: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageChannelMessageAssociationMessageFolder'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageChannelMessageAssociationMessageFolder',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.messageChannelMessageAssociationMessageFolder
            .universalIdentifier,
        nameSingular: 'messageChannelMessageAssociationMessageFolder',
        namePlural: 'messageChannelMessageAssociationMessageFolders',
        labelSingular: i18nLabel(msg`Relasi Folder Pesan Saluran`),
        labelPlural: i18nLabel(msg`Relasi Folder Pesan Saluran`),
        description: i18nLabel(
          msg`Tabel relasi antara pesan saluran dan folder pesan`,
        ),
        icon: 'IconFolder',
        isSystem: true,
        isAuditLogged: false,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  messageParticipant: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageParticipant'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageParticipant',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.messageParticipant.universalIdentifier,
        nameSingular: 'messageParticipant',
        namePlural: 'messageParticipants',
        labelSingular: i18nLabel(msg`Peserta Pesan`),
        labelPlural: i18nLabel(msg`Peserta Pesan`),
        description: i18nLabel(msg`Peserta pesan`),
        icon: 'IconUserCircle',
        isSystem: true,
        isAuditLogged: false,
        labelIdentifierFieldMetadataName: 'handle',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  messageThread: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'messageThread'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'messageThread',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.messageThread.universalIdentifier,
        nameSingular: 'messageThread',
        namePlural: 'messageThreads',
        labelSingular: i18nLabel(msg`Utas Pesan`),
        labelPlural: i18nLabel(msg`Utas Pesan`),
        description: i18nLabel(msg`Utas percakapan pesan`),
        icon: 'IconMessage',
        isSystem: true,
        isAuditLogged: false,
        labelIdentifierFieldMetadataName: 'subject',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  message: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'message'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'message',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.message.universalIdentifier,
        nameSingular: 'message',
        namePlural: 'messages',
        labelSingular: i18nLabel(msg`Pesan`),
        labelPlural: i18nLabel(msg`Pesan`),
        description: i18nLabel(msg`Pesan`),
        icon: 'IconMessage',
        isSystem: true,
        isAuditLogged: false,
        labelIdentifierFieldMetadataName: 'subject',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  note: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'note'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'note',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.note.universalIdentifier,
        nameSingular: 'note',
        namePlural: 'notes',
        labelSingular: i18nLabel(msg`Catatan`),
        labelPlural: i18nLabel(msg`Catatan`),
        description: i18nLabel(msg`Catatan tertulis`),
        icon: 'IconNotes',
        isSearchable: true,
        shortcut: 'N',
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  noteTarget: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'noteTarget'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'noteTarget',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.noteTarget.universalIdentifier,
        nameSingular: 'noteTarget',
        namePlural: 'noteTargets',
        labelSingular: i18nLabel(msg`Target Catatan`),
        labelPlural: i18nLabel(msg`Target Catatan`),
        description: i18nLabel(msg`Target catatan`),
        icon: 'IconCheckbox',
        isSystem: true,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  opportunity: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'opportunity'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'opportunity',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.opportunity.universalIdentifier,
        nameSingular: 'opportunity',
        namePlural: 'opportunities',
        labelSingular: i18nLabel(msg`Opportunity`),
        labelPlural: i18nLabel(msg`Opportunities`),
        description: i18nLabel(msg`An opportunity`),
        icon: 'IconTargetArrow',
        isSearchable: true,
        shortcut: 'O',
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  person: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'person'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'person',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.person.universalIdentifier,
        nameSingular: 'person',
        namePlural: 'people',
        labelSingular: i18nLabel(msg`Person`),
        labelPlural: i18nLabel(msg`People`),
        description: i18nLabel(msg`A person`),
        icon: 'IconUser',
        isSearchable: true,
        shortcut: 'P',
        duplicateCriteria: [
          ['nameFirstName', 'nameLastName'],
          ['linkedinLinkPrimaryLinkUrl'],
          ['emailsPrimaryEmail'],
        ],
        labelIdentifierFieldMetadataName: 'name',
        imageIdentifierFieldMetadataName: 'avatarUrl',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  task: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'task'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'task',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.task.universalIdentifier,
        nameSingular: 'task',
        namePlural: 'tasks',
        labelSingular: i18nLabel(msg`Tugas`),
        labelPlural: i18nLabel(msg`Tugas`),
        description: i18nLabel(msg`Tugas yang harus dikerjakan`),
        icon: 'IconCheckbox',
        isSearchable: true,
        shortcut: 'T',
        labelIdentifierFieldMetadataName: 'title',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  taskTarget: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'taskTarget'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'taskTarget',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.taskTarget.universalIdentifier,
        nameSingular: 'taskTarget',
        namePlural: 'taskTargets',
        labelSingular: i18nLabel(msg`Target Tugas`),
        labelPlural: i18nLabel(msg`Target Tugas`),
        description: i18nLabel(msg`Target tugas`),
        icon: 'IconCheckbox',
        isSystem: true,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  timelineActivity: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'timelineActivity'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'timelineActivity',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.timelineActivity.universalIdentifier,
        nameSingular: 'timelineActivity',
        namePlural: 'timelineActivities',
        labelSingular: i18nLabel(msg`Aktivitas Linimasa`),
        labelPlural: i18nLabel(msg`Aktivitas Linimasa`),
        description: i18nLabel(
          msg`Aktivitas teragregasi yang ditampilkan pada linimasa`,
        ),
        icon: 'IconTimelineEvent',
        isSystem: true,
        isAuditLogged: false,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  workflow: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'workflow'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'workflow',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.workflow.universalIdentifier,
        nameSingular: 'workflow',
        namePlural: 'workflows',
        labelSingular: i18nLabel(msg`Alur Kerja`),
        labelPlural: i18nLabel(msg`Alur Kerja`),
        description: i18nLabel(msg`Alur kerja otomatisasi`),
        icon: 'IconSettingsAutomation',
        isSearchable: true,
        shortcut: 'W',
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  workflowAutomatedTrigger: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'workflowAutomatedTrigger'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'workflowAutomatedTrigger',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.workflowAutomatedTrigger.universalIdentifier,
        nameSingular: 'workflowAutomatedTrigger',
        namePlural: 'workflowAutomatedTriggers',
        labelSingular: i18nLabel(msg`Pemicu Otomatis Alur Kerja`),
        labelPlural: i18nLabel(msg`Pemicu Otomatis Alur Kerja`),
        description: i18nLabel(msg`Pemicu otomatis untuk alur kerja`),
        icon: 'IconSettingsAutomation',
        isSystem: true,
        labelIdentifierFieldMetadataName: 'id',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  workflowRun: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<CreateStandardObjectArgs<'workflowRun'>, 'context' | 'objectName'>) =>
    createStandardObjectFlatMetadata({
      objectName: 'workflowRun',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier: STANDARD_OBJECTS.workflowRun.universalIdentifier,
        nameSingular: 'workflowRun',
        namePlural: 'workflowRuns',
        labelSingular: i18nLabel(msg`Eksekusi Alur Kerja`),
        labelPlural: i18nLabel(msg`Eksekusi Alur Kerja`),
        description: i18nLabel(msg`Catatan eksekusi alur kerja`),
        icon: 'IconHistoryToggle',
        isSystem: true,
        isAuditLogged: false,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  workflowVersion: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'workflowVersion'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'workflowVersion',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.workflowVersion.universalIdentifier,
        nameSingular: 'workflowVersion',
        namePlural: 'workflowVersions',
        labelSingular: i18nLabel(msg`Versi Alur Kerja`),
        labelPlural: i18nLabel(msg`Versi Alur Kerja`),
        description: i18nLabel(msg`Versi dari sebuah alur kerja`),
        icon: 'IconVersions',
        isSystem: true,
        labelIdentifierFieldMetadataName: 'name',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
  workspaceMember: ({
    now,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    badesStandardApplicationId,
    dependencyFlatEntityMaps,
  }: Omit<
    CreateStandardObjectArgs<'workspaceMember'>,
    'context' | 'objectName'
  >) =>
    createStandardObjectFlatMetadata({
      objectName: 'workspaceMember',
      dependencyFlatEntityMaps,
      context: {
        universalIdentifier:
          STANDARD_OBJECTS.workspaceMember.universalIdentifier,
        nameSingular: 'workspaceMember',
        namePlural: 'workspaceMembers',
        labelSingular: i18nLabel(msg`Anggota Workspace`),
        labelPlural: i18nLabel(msg`Anggota Workspace`),
        description: i18nLabel(msg`Anggota dalam workspace`),
        icon: 'IconUserCircle',
        isSystem: true,
        isSearchable: true,
        labelIdentifierFieldMetadataName: 'name',
        imageIdentifierFieldMetadataName: 'avatarUrl',
      },
      workspaceId,
      standardObjectMetadataRelatedEntityIds,
      badesStandardApplicationId,
      now,
    }),
} satisfies {
  [P in AllStandardObjectName]: (
    args: Omit<CreateStandardObjectArgs<P>, 'context' | 'objectName'>,
  ) => FlatObjectMetadata;
};
