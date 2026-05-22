import { getPageTitleFromPath } from '~/utils/title-utils';

describe('title-utils', () => {
  it('should return the correct title for a given path', () => {
    expect(getPageTitleFromPath('/verify')).toBe('Verifikasi');
    expect(getPageTitleFromPath('/welcome')).toBe(
      'Masuk atau Buat Akun',
    );
    expect(getPageTitleFromPath('/invite/:workspaceInviteHash')).toBe('Undangan');
    expect(getPageTitleFromPath('/create/workspace')).toBe('Buat Ruang Kerja');
    expect(getPageTitleFromPath('/create/profile')).toBe('Buat Profil');
    expect(getPageTitleFromPath('/settings/objects/opportunities')).toBe(
      'Model Data - Pengaturan',
    );
    expect(getPageTitleFromPath('/settings/profile')).toBe(
      'Profil - Pengaturan',
    );
    expect(getPageTitleFromPath('/settings/experience')).toBe(
      'Tampilan - Pengaturan',
    );
    expect(getPageTitleFromPath('/settings/accounts')).toBe(
      'Akun - Pengaturan',
    );
    expect(getPageTitleFromPath('/settings/accounts/new')).toBe(
      'Akun - Pengaturan',
    );
    expect(getPageTitleFromPath('/settings/accounts/calendars')).toBe(
      'Akun - Pengaturan',
    );
    expect(
      getPageTitleFromPath('/settings/accounts/calendars/:accountUuid'),
    ).toBe('Akun - Pengaturan');
    expect(getPageTitleFromPath('/settings/accounts/emails')).toBe(
      'Akun - Pengaturan',
    );
    expect(getPageTitleFromPath('/settings/accounts/emails/:accountUuid')).toBe(
      'Akun - Pengaturan',
    );
    expect(getPageTitleFromPath('/settings/members')).toBe(
      'Anggota - Pengaturan',
    );
    expect(getPageTitleFromPath('/settings/general')).toBe(
      'Umum - Pengaturan',
    );
    expect(getPageTitleFromPath('/')).toBe('Bades.id');
    expect(getPageTitleFromPath('/random')).toBe('Bades.id');
  });
});
