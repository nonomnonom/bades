import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { AdminPanelModule } from 'src/engine/core-modules/admin-panel/admin-panel.module';
import { HealthController } from 'src/engine/core-modules/health/controllers/health.controller';

@Module({
  imports: [TerminusModule, AdminPanelModule],
  controllers: [HealthController],
})
export class HealthModule {}
