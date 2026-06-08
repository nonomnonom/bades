export const MAPBOX_STANDARD_STYLES = {
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
} as const;

// Font glyph bawaan Mapbox Standard — hindari Noto Sans yang sering 404
// jika token tidak punya scope fonts:read atau akun tidak punya akses font.
export const MAPBOX_CLUSTER_TEXT_FONT = ['Open Sans Bold'] as const;
