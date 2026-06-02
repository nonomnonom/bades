import { Controller, Get, UseGuards } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { DatabaseHealthIndicator } from 'src/engine/core-modules/admin-panel/indicators/database.health';
import { RedisHealthIndicator } from 'src/engine/core-modules/admin-panel/indicators/redis.health';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';

@Controller('healthz')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly databaseHealth: DatabaseHealthIndicator,
    private readonly redisHealth: RedisHealthIndicator,
  ) {}

  @Get()
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.databaseHealth.isHealthy(),
      () => this.redisHealth.isHealthy(),
    ]);
  }
}
