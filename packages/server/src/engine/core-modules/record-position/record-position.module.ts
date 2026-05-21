import { Module } from '@nestjs/common';

import { SidOrmModule } from 'src/engine/sid-orm/sid-orm.module';

import { RecordPositionService } from './services/record-position.service';

@Module({
  imports: [SidOrmModule],
  providers: [RecordPositionService],
  exports: [RecordPositionService],
})
export class RecordPositionModule {}
