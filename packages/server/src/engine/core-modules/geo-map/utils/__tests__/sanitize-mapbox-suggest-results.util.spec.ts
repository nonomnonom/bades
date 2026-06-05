import { sanitizeMapboxSuggestResults } from 'src/engine/core-modules/geo-map/utils/sanitize-mapbox-suggest-results.util';

describe('sanitizeMapboxSuggestResults', () => {
  it('should return empty array for empty input', () => {
    expect(sanitizeMapboxSuggestResults([])).toEqual([]);
  });

  it('should map suggestions to text and placeId', () => {
    const result = sanitizeMapboxSuggestResults([
      {
        name: 'Balai Desa Nonom',
        mapbox_id: 'dXJuOm1ieGFkcjplcG9pOn...',
        full_address:
          'Jl. Raya Nonom No. 1, Nonom, Jawa Barat 41234, Indonesia',
      },
      {
        name: 'Nonom',
        mapbox_id: 'dXJuOm1ieHBsYzpwbGFjZT...',
        address: 'Nonom',
        place_formatted: 'Jawa Barat, Indonesia',
      },
    ]);

    expect(result).toEqual([
      {
        text: 'Jl. Raya Nonom No. 1, Nonom, Jawa Barat 41234, Indonesia',
        placeId: 'dXJuOm1ieGFkcjplcG9pOn...',
      },
      {
        text: 'Nonom, Jawa Barat, Indonesia',
        placeId: 'dXJuOm1ieHBsYzpwbGFjZT...',
      },
    ]);
  });
});
