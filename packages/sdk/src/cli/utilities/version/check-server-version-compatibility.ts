import chalk from 'chalk';

import { CONTAINER_NAME } from '@/cli/utilities/server/docker-container';
import { getVersionInfo } from '@/cli/utilities/version/get-version-info';

const STALE_THRESHOLD_DAYS = 7;

export const checkServerVersionCompatibility = async (
  containerName: string = CONTAINER_NAME,
): Promise<void> => {
  const info = await getVersionInfo(containerName);

  if (
    info.localServerVersion === null ||
    info.latestServerVersion === null ||
    !info.isMinorOrMajorBehind ||
    info.daysBehind === null ||
    info.daysBehind <= STALE_THRESHOLD_DAYS
  ) {
    return;
  }

  console.warn(
    chalk.yellow(
      `⚠ Local Bades server is v${info.localServerVersion} (${info.daysBehind} hari di belakang v${info.latestServerVersion}).`,
    ),
  );
  console.warn(chalk.dim('  Update with: yarn bades docker:upgrade'));
  console.warn('');
};
