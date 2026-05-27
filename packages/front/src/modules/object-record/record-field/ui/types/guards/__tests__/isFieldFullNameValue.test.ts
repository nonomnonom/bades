import { isFieldFullNameValue } from '@/object-record/record-field/ui/types/guards/isFieldFullNameValue';

describe('isFieldFullNameValue', () => {
  it('should return true for valid full name objects', () => {
    expect(
      isFieldFullNameValue({ firstName: 'Budi', lastName: 'Saputra' }),
    ).toBe(true);
    expect(isFieldFullNameValue({ firstName: '', lastName: '' })).toBe(true);
  });

  it('should return false for incomplete objects', () => {
    expect(isFieldFullNameValue({ firstName: 'Budi' })).toBe(false);
    expect(isFieldFullNameValue({ lastName: 'Saputra' })).toBe(false);
  });

  it('should return false for non-object values', () => {
    expect(isFieldFullNameValue('Budi Santoso')).toBe(false);
    expect(isFieldFullNameValue(null)).toBe(false);
    expect(isFieldFullNameValue(undefined)).toBe(false);
  });
});
