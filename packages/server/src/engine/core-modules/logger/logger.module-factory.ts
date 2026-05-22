import {
  LoggerDriverType,
  type LoggerModuleOptions,
} from 'src/engine/core-modules/logger/interfaces';
import { type BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

/**
 * Logger Module factory
 * @returns LoggerModuleOptions
 * @param twentyConfigService
 */
export const loggerModuleFactory = async (
  twentyConfigService: BadesConfigService,
): Promise<LoggerModuleOptions> => {
  const driverType = twentyConfigService.get('LOGGER_DRIVER');
  const logLevels = twentyConfigService.get('LOG_LEVELS');

  switch (driverType) {
    case LoggerDriverType.CONSOLE: {
      return {
        type: LoggerDriverType.CONSOLE,
        logLevels: logLevels,
      };
    }
    default:
      throw new Error(
        `Invalid logger driver type (${driverType}), check your .env file`,
      );
  }
};
