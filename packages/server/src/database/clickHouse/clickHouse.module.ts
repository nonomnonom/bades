import { Module } from '@nestjs/common';

import { BadesConfigModule } from 'src/engine/core-modules/bades-config/bades-config.module';

import { ClickHouseService } from './clickHouse.service';

@Module({
  imports: [BadesConfigModule],
  providers: [ClickHouseService],
  exports: [ClickHouseService],
})
export class ClickHouseModule {}
