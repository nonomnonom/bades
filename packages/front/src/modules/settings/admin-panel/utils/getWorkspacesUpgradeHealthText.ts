import { plural } from '@lingui/core/macro';

export const getWorkspacesUpgradeHealthText = (
  behindCount: number,
  failedCount: number,
  upToDateLabel: string,
): string => {
  if (failedCount > 0 && behindCount > 0) {
    return plural(failedCount + behindCount, {
      one: '# ruang kerja gagal atau tertinggal',
      other: '# ruang kerja gagal atau tertinggal',
    });
  }

  if (failedCount > 0) {
    return plural(failedCount, {
      one: '# ruang kerja gagal',
      other: '# ruang kerja gagal',
    });
  }

  if (behindCount > 0) {
    return plural(behindCount, {
      one: '# ruang kerja tertinggal',
      other: '# ruang kerja tertinggal',
    });
  }

  return upToDateLabel;
};
