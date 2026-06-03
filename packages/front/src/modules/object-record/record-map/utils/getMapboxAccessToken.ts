// Helper untuk baca token Mapbox dari env Vite.
// Dipisah ke module tersendiri supaya test bisa mock via
// `jest.mock('@/object-record/record-map/utils/getMapboxAccessToken')`
// tanpa harus berurusan dengan `import.meta` syntax yang tidak didukung
// oleh jest SWC transformer di project ini.
export const getMapboxAccessToken = (): string =>
  (import.meta.env.REACT_APP_MAPBOX_ACCESS_TOKEN as string | undefined) ?? '';
