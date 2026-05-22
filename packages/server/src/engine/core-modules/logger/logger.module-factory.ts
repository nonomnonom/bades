import {
  LoggerDriverType,
  type LoggerModuleOptions,
} from 'src/engine/core-modules/logger/interfaces';
import { type BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

/**
 * Logger Module factory
 * @returns LoggerModuleOptions
 * @param badesConfigService
 */
export const loggerModuleFactory = async (
  badesConfigService: BadesConfigService,
): Promise<LoggerModuleOptions> => {
  const driverType = badesConfigService.get('LOGGER_DRIVER');
  const logLevels = badesConfigService.get('LOG_LEVELS');

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
