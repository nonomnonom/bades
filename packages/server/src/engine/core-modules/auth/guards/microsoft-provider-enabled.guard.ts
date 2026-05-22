import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';

import {
  AuthException,
  AuthExceptionCode,
} from 'src/engine/core-modules/auth/auth.exception';
import { MicrosoftStrategy } from 'src/engine/core-modules/auth/strategies/microsoft.auth.strategy';
import { GuardRedirectService } from 'src/engine/core-modules/guard-redirect/services/guard-redirect.service';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

@Injectable()
export class MicrosoftProviderEnabledGuard implements CanActivate {
  constructor(
    private readonly twentyConfigService: BadesConfigService,
    private readonly guardRedirectService: GuardRedirectService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      if (!this.twentyConfigService.get('AUTH_MICROSOFT_ENABLED')) {
        throw new AuthException(
          'Microsoft auth is not enabled',
          AuthExceptionCode.MICROSOFT_API_AUTH_DISABLED,
        );
      }

      new MicrosoftStrategy(this.twentyConfigService);

      return true;
    } catch (err) {
      this.guardRedirectService.dispatchErrorFromGuard(
        context,
        err,
        this.guardRedirectService.getSubdomainAndCustomDomainFromContext(
          context,
        ),
      );

      return false;
    }
  }
}
