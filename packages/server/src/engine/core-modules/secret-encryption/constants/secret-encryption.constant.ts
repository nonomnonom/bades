export const SECRET_ENCRYPTION_ENVELOPE_PREFIX = 'enc:';
export const SECRET_ENCRYPTION_ENVELOPE_V2_PREFIX = 'enc:v2:';

export const SECRET_ENCRYPTION_KEY_ID_REGEX = /^[0-9a-f]{8}$/;

export const SECRET_ENCRYPTION_GCM_IV_LENGTH = 12;
export const SECRET_ENCRYPTION_GCM_TAG_LENGTH = 16;
export const SECRET_ENCRYPTION_DERIVED_KEY_LENGTH = 32;
// Bades: PREFIX HKDF info string DIBEKUKAN sebagai `twenty:*` untuk
// kompatibilitas data ter-encrypt yang sudah ada di production. Mengubah
// prefix akan membuat semua secret yang sudah dienkripsi tidak dapat
// di-decrypt — termasuk credential workspace, API key integrasi, OAuth
// token, dst. Per GOAL.md "Jika ada nama teknis internal yang belum aman
// diubah, pisahkan antara branding publik dan identifier internal
// sementara". Identifier ini adalah identifier internal yang tidak pernah
// terlihat user akhir — aman untuk dipertahankan.
export const SECRET_ENCRYPTION_HKDF_INFO_PREFIX = 'twenty:enc:v2:';
export const SECRET_ENCRYPTION_INSTANCE_CONTEXT = 'instance';

// Lihat catatan di atas — prefix HMAC juga dibekukan untuk konsistensi
// derivasi kunci dengan secret yang sudah ada.
export const INSTANCE_HMAC_HKDF_INFO_PREFIX = 'twenty:hmac:v1:';
export const INSTANCE_HMAC_DERIVED_KEY_LENGTH = 32;
