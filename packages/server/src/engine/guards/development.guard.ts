import {
  type CanActivate,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { NodeEnvironment } from 'src/engine/core-modules/bades-config/interfaces/node-environment.interface';

import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

@Injectable()
export class DevelopmentGuard implements CanActivate {
  constructor(private readonly badesConfigService: BadesConfigService) {}

  canActivate(): boolean {
    const nodeEnv = this.badesConfigService.get('NODE_ENV');

    if (
      nodeEnv !== NodeEnvironment.DEVELOPMENT &&
      nodeEnv !== NodeEnvironment.TEST
    ) {
      throw new ForbiddenException(
        'This endpoint is only available in development or test environments',
      );
    }

    return true;
  }
}
