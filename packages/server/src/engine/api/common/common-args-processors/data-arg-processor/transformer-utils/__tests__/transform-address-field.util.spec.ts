import { transformAddressField } from 'src/engine/api/common/common-args-processors/data-arg-processor/transformer-utils/transform-address-field.util';

describe('transformAddressField', () => {
  it('should return null when value is null', () => {
    const result = transformAddressField(null);

    expect(result).toBeNull();
  });

  it('should return an empty object when value is an empty object', () => {
    const result = transformAddressField({});

    expect(result).toEqual({});
  });

  it('should preserve undefined for fields that are not provided', () => {
    const result = transformAddressField({
      addressStreet1: 'Jl. Sukamaju No. 1',
      addressCity: 'Desa Sukamaju',
    });

    expect(result).toEqual({
      addressStreet1: 'Jl. Sukamaju No. 1',
      addressCity: 'Desa Sukamaju',
    });
  });

  it('should handle mixed null, undefined, and valid values', () => {
    const result = transformAddressField({
      addressStreet1: 'Jl. Sukamaju No. 1',
      addressStreet2: null,
      addressCity: 'Desa Sukamaju',
      addressLat: -7.5755,
      addressLng: null,
    });

    expect(result).toEqual({
      addressStreet1: 'Jl. Sukamaju No. 1',
      addressStreet2: null,
      addressCity: 'Desa Sukamaju',
      addressLat: -7.5755,
      addressLng: null,
    });
  });
});
