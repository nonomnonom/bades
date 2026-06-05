/* oxlint-disable bades/no-hardcoded-colors */
//
// Mapbox GL layer paint properties hanya menerima hex string — tidak
// mem-parse CSS `var(--t-*)` maupun `color(display-p3 ...)` yang
// digunakan palet Radix UI. Nilai hex di sini selaras dengan palet
// semantic Bades (light): RadixColors.indigoP3.indigo9 = #4673E8, dll.
//
// Jika theme system berubah, update nilai hex ini secara manual agar
// konsisten dengan MAIN_COLORS_LIGHT (ui/theme).

export const MAPBOX_MAP_COLORS = {
  blue: '#4673E8',
  green: '#30A46C',
  orange: '#F76808',
  red: '#E5484D',
  purple: '#8E4EC6',
  gray: '#8B8D98',
  white: '#FFFFFF',

  // Turunan untuk cluster — menjadi bagian dari MAPBOX_MAP_COLORS agar
  // tidak perlu file terpisah (max-consts-per-file = 1). Nilai disimpan
  // eksplisit (bukan referensi alias) supaya hint IDE dan bundle tetap
  // independen jika kelak cluster ingin warna berbeda dari palette base.
  cluster: '#4673E8',
  clusterText: '#FFFFFF',
  defaultMarker: '#4673E8',
} as const;
