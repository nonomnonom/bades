import { HealthCheckService, TerminusModule } from '@nestjs/terminus';
import { Test, type TestingModule } from '@nestjs/testing';

import { DatabaseHealthIndicator } from 'src/engine/core-modules/admin-panel/indicators/database.health';
import { RedisHealthIndicator } from 'src/engine/core-modules/admin-panel/indicators/redis.health';
import { HealthController } from 'src/engine/core-modules/health/controllers/health.controller';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const mockDatabaseHealthIndicator = {
      isHealthy: jest.fn().mockResolvedValue({ database: { status: 'up' } }),
    };
    const mockRedisHealthIndicator = {
      isHealthy: jest.fn().mockResolvedValue({ redis: { status: 'up' } }),
    };

    const testingModule: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [
        {
          provide: DatabaseHealthIndicator,
          useValue: mockDatabaseHealthIndicator,
        },
        {
          provide: RedisHealthIndicator,
          useValue: mockRedisHealthIndicator,
        },
      ],
    })
      .overrideProvider(HealthCheckService)
      .useValue({ check: jest.fn() })
      .compile();

    healthController = testingModule.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(healthController).toBeDefined();
  });
});
