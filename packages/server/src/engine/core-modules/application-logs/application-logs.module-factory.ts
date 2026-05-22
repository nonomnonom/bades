import { type BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

import { type OPTIONS_TYPE } from 'src/engine/core-modules/application-logs/application-logs.module-definition';
import { ApplicationLogDriver } from 'src/engine/core-modules/application-logs/interfaces/application-log-driver.enum';

export const applicationLogsModuleFactory = async (
  twentyConfigService: BadesConfigService,
): Promise<typeof OPTIONS_TYPE> => {
  const driverType = twentyConfigService.get('APPLICATION_LOG_DRIVER');

  return {
    type: driverType as ApplicationLogDriver,
  };
};
