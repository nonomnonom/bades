import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

@Injectable()
export class BillingDisabledGuard implements CanActivate {
  constructor(private readonly badesConfigService: BadesConfigService) {}

  canActivate(_context: ExecutionContext): boolean {
    return !this.badesConfigService.isBillingEnabled();
  }
}
