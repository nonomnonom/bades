import { Global, Module } from '@nestjs/common';

import { RedisClientService } from 'src/engine/core-modules/redis-client/redis-client.service';
import { BadesConfigModule } from 'src/engine/core-modules/bades-config/bades-config.module';

@Global()
@Module({
  imports: [BadesConfigModule],
  providers: [RedisClientService],
  exports: [RedisClientService],
})
export class RedisClientModule {}
