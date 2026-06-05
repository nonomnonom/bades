/* oxlint-disable bades/no-hardcoded-colors, bades/max-consts-per-file */
//
// Warna hex untuk layer paint Mapbox GL — Mapbox tidak mem-parse CSS
// `var(--t-*)`. Nilai di sini selaras dengan palet semantic Bades (light).
//
// Multiple consts dalam satu file karena semua konstanta ini saling
// referensi (MAPBOX_CATEGORY_COLORS menggunakan MAPBOX_MAP_COLORS).
export const MAPBOX_MAP_COLORS = {
  blue: '#4673E8',
  green: '#30A46C',
  orange: '#F76808',
  red: '#E5484D',
  purple: '#8E4EC6',
  gray: '#8B8D98',
  white: '#FFFFFF',
} as const;

export const MAPBOX_CLUSTER_COLOR = MAPBOX_MAP_COLORS.blue;
export const MAPBOX_CLUSTER_TEXT_COLOR = MAPBOX_MAP_COLORS.white;
export const MAPBOX_DEFAULT_MARKER_COLOR = MAPBOX_MAP_COLORS.blue;

// Warna marker berdasarkan kategori — palet aksesibel untuk operator desa.
export const MAPBOX_CATEGORY_COLORS: Record<string, string> = {
  KS1: MAPBOX_MAP_COLORS.green,
  KS2: MAPBOX_MAP_COLORS.orange,
  KS3: MAPBOX_MAP_COLORS.blue,
  KS4: MAPBOX_MAP_COLORS.purple,
  TERVERIFIKASI: MAPBOX_MAP_COLORS.green,
  MENUNGGU: MAPBOX_MAP_COLORS.orange,
  DITOLAK: MAPBOX_MAP_COLORS.red,
  SELESAI: MAPBOX_MAP_COLORS.green,
  DIPROSES: MAPBOX_MAP_COLORS.blue,
  PELAKSANAAN: MAPBOX_MAP_COLORS.green,
  PERENCANAAN: MAPBOX_MAP_COLORS.blue,
  DUSUN: MAPBOX_MAP_COLORS.green,
  RW: MAPBOX_MAP_COLORS.blue,
  RT: MAPBOX_MAP_COLORS.orange,
  BAIK: MAPBOX_MAP_COLORS.green,
  RUSAK_RINGAN: MAPBOX_MAP_COLORS.orange,
  RUSAK_BERAT: MAPBOX_MAP_COLORS.red,
  AKTIF: MAPBOX_MAP_COLORS.green,
  TIDAK_AKTIF: MAPBOX_MAP_COLORS.gray,
};
