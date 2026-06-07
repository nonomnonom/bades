import { isValidAuthTokenPair } from '@/apollo/utils/isValidAuthTokenPair';

describe('isValidAuthTokenPair', () => {
  it('menerima token pair yang valid', () => {
    expect(
      isValidAuthTokenPair({
        accessOrWorkspaceAgnosticToken: {
          token: 'valid-token',
          expiresAt: '2099-01-01',
        },
      }),
    ).toBe(true);
  });

  it('menolak token kosong atau whitespace', () => {
    expect(
      isValidAuthTokenPair({
        accessOrWorkspaceAgnosticToken: {
          token: '',
          expiresAt: '2099-01-01',
        },
      }),
    ).toBe(false);

    expect(
      isValidAuthTokenPair({
        accessOrWorkspaceAgnosticToken: {
          token: '   ',
          expiresAt: '2099-01-01',
        },
      }),
    ).toBe(false);
  });

  it('menolak payload yang tidak valid', () => {
    expect(isValidAuthTokenPair(null)).toBe(false);
    expect(isValidAuthTokenPair(undefined)).toBe(false);
    expect(isValidAuthTokenPair({})).toBe(false);
  });
});
