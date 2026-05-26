import { nullifyEmptyFullNameDefaultValue } from '../nullify-empty-full-name-default-value.util';

describe('nullifyEmptyFullNameDefaultValue', () => {
  it('returns null when both sub-fields are empty-string equivalents', () => {
    expect(
      nullifyEmptyFullNameDefaultValue({ firstName: "''", lastName: '' }),
    ).toBeNull();
  });

  it('returns normalized object when lastName has a value', () => {
    expect(
      nullifyEmptyFullNameDefaultValue({
        firstName: "''",
        lastName: 'Saputra',
      }),
    ).toEqual({ firstName: null, lastName: 'Saputra' });
  });
});
