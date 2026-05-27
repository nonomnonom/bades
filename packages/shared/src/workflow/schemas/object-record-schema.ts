import { z } from 'zod';

export const objectRecordSchema = z
  .record(z.string(), z.any())
  .describe(
    'Record data object. Use nested objects for relationships (e.g., "keluarga": {"id": "{{reference}}"}). Common patterns:\n' +
      '- Penduduk: {"name": {"firstName": "Budi", "lastName": "Santoso"}, "emails": {"primaryEmail": "budi@bades.id"}, "keluarga": {"id": "{{trigger.object.id}}"}}\n' +
      '- Keluarga: {"name": "Keluarga Anggrek", "domainName": {"primaryLinkUrl": "https://bades.id"}}\n' +
      '- Tugas: {"title": "Tindak lanjut", "status": "TODO", "assignee": {"id": "{{user.id}}"}}',
  );
