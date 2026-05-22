import { Module } from '@nestjs/common';

import { JwtModule } from 'src/engine/core-modules/jwt/jwt.module';
import { BadesConfigModule } from 'src/engine/core-modules/bades-config/bades-config.module';
import { MicrosoftAPIRefreshAccessTokenService } from 'src/modules/connected-account/refresh-tokens-manager/drivers/microsoft/services/microsoft-api-refresh-tokens.service';

@Module({
  imports: [BadesConfigModule, JwtModule],
  providers: [MicrosoftAPIRefreshAccessTokenService],
  exports: [MicrosoftAPIRefreshAccessTokenService],
})
export class MicrosoftAPIRefreshAccessTokenModule {}
