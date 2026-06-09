// ID constants untuk entity core yang di-seed oleh seed-metadata-entities.util.ts
// File ini menggantikan constants yang sebelumnya berada di data/constants/* yang sudah dihapus.

// Catatan: sengaja tanpa `as const` agar kompatibel dengan YC workspace variants
// yang menggunakan UUID berbeda tetapi bentuk objek sama.
export const CONNECTED_ACCOUNT_DATA_SEED_IDS: Record<string, string> = {
  KADES: '20202020-9ac0-4390-9a1a-ab4d2c4e1bb7',
  SEKDES: '20202020-0cc8-4d60-a3a4-803245698908',
  KAUR: '20202020-cafc-4323-908d-e5b42ad69fdf',
  KASI: '20202020-b5c7-46f0-bf5c-3f4e4b3f7c1a',
  KASI_DELETABLE: '20202020-d1e5-4a8f-9c3b-7f6d5e4c3b2a',
};

export const MESSAGE_CHANNEL_DATA_SEED_IDS: Record<string, string> = {
  KADES: '20202020-9b80-4c2c-a597-383db48de1d6',
  SEKDES: '20202020-5ffe-4b32-814a-983d5e4911cd',
  KAUR: '20202020-e2f1-49b5-85d2-5d3a3386990c',
  KASI: '20202020-8c4d-4e71-a672-2e6a8c9f1b3d',
  SUPPORT: '20202020-e2f1-49b5-85d2-5d3a3386990d',
  SALES: '20202020-e2f1-49b5-85d2-5d3a3386990e',
};

export const CALENDAR_CHANNEL_DATA_SEED_IDS: Record<string, string> = {
  KADES: '20202020-a40f-4faf-bb9f-c6f9945b8203',
  SEKDES: '20202020-a40f-4faf-bb9f-c6f9945b8204',
  KAUR: '20202020-a40f-4faf-bb9f-c6f9945b8205',
  KASI: '20202020-a40f-4faf-bb9f-c6f9945b8208',
  COMPANY_MAIN: '20202020-a40f-4faf-bb9f-c6f9945b8206',
  TEAM_CALENDAR: '20202020-a40f-4faf-bb9f-c6f9945b8207',
};

export const MESSAGE_FOLDER_DATA_SEED_IDS: Record<string, string> = {
  TIM_INBOX: '20202020-f1a2-4b3c-8d4e-5f6a7b8c9d0e',
  TIM_SENT: '20202020-f1a2-4b3c-8d4e-5f6a7b8c9d1e',
  JONY_INBOX: '20202020-f1a2-4b3c-8d4e-5f6a7b8c9d2e',
  JANE_INBOX: '20202020-f1a2-4b3c-8d4e-5f6a7b8c9d3e',
  JANE_SENT: '20202020-f1a2-4b3c-8d4e-5f6a7b8c9d4e',
};
