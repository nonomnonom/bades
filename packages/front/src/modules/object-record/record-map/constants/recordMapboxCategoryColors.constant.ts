import { MAPBOX_MAP_COLORS } from './recordMapboxMapColors.constant';

// Warna marker berdasarkan kategori — palet aksesibel untuk operator desa.
// Dipisah dari cluster colors agar tiap file hanya 1 const (max-consts-per-file).
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
