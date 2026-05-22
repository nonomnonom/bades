import { type HttpAdapterHost } from '@nestjs/core';

import { NodeEnvironment } from 'src/engine/core-modules/bades-config/interfaces/node-environment.interface';

import { type OPTIONS_TYPE } from 'src/engine/core-modules/exception-handler/exception-handler.module-definition';
import { ExceptionHandlerDriver } from 'src/engine/core-modules/exception-handler/interfaces';
import { type BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

/**
 * ExceptionHandler Module factory
 * @returns ExceptionHandlerModuleOptions
 * @param badesConfigService
 * @param adapterHost
 */
export const exceptionHandlerModuleFactory = async (
  badesConfigService: BadesConfigService,
  adapterHost: HttpAdapterHost,
): Promise<typeof OPTIONS_TYPE> => {
  const driverType = badesConfigService.get('EXCEPTION_HANDLER_DRIVER');

  switch (driverType) {
    case ExceptionHandlerDriver.CONSOLE: {
      return {
        type: ExceptionHandlerDriver.CONSOLE,
      };
    }
    case ExceptionHandlerDriver.SENTRY: {
      return {
        type: ExceptionHandlerDriver.SENTRY,
        options: {
          environment: badesConfigService.get('SENTRY_ENVIRONMENT'),
          release: badesConfigService.get('APP_VERSION'),
          dsn: badesConfigService.get('SENTRY_DSN') ?? '',
          serverInstance: adapterHost.httpAdapter?.getInstance(),
          debug:
            badesConfigService.get('NODE_ENV') === NodeEnvironment.DEVELOPMENT,
        },
      };
    }
    default:
      throw new Error(
        `Invalid exception capturer driver type (${driverType}), check your .env file`,
      );
  }
};
