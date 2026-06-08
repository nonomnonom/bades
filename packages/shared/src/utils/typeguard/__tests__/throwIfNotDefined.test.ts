import { throwIfNotDefined } from '@/utils/typeguard/throwIfNotDefined';

describe('throwIfNotDefined', () => {
  it('should not throw for defined values', () => {
    expect(() => throwIfNotDefined('hello', 'myVar')).not.toThrow();
    expect(() => throwIfNotDefined(0, 'myVar')).not.toThrow();
    expect(() => throwIfNotDefined(false, 'myVar')).not.toThrow();
    expect(() => throwIfNotDefined('', 'myVar')).not.toThrow();
  });

  it('should throw for null', () => {
    expect(() => throwIfNotDefined(null, 'myVar')).toThrow(
      'Nilai harus terdefinisi untuk variabel myVar',
    );
  });

  it('should throw for undefined', () => {
    expect(() => throwIfNotDefined(undefined, 'myVar')).toThrow(
      'Nilai harus terdefinisi untuk variabel myVar',
    );
  });
});
