/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';

import { ClickHouseService } from 'src/database/clickHouse/clickHouse.service';
import { formatDateTimeForClickHouse } from 'src/database/clickHouse/clickHouse.util';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';
import { type UsageEvent } from 'src/engine/core-modules/usage/types/usage-event.type';

@Injectable()
export class UsageEventWriterService {
  private readonly logger = new Logger(UsageEventWriterService.name);

  constructor(
    private readonly clickHouseService: ClickHouseService,
    private readonly badesConfigService: BadesConfigService,
  ) {}

  writeToClickHouse(workspaceId: string, usageEvents: UsageEvent[]): void {
    if (!this.badesConfigService.get('CLICKHOUSE_URL')) {
      return;
    }

    const now = formatDateTimeForClickHouse(new Date());

    const rows = usageEvents.map((usageEvent) => ({
      timestamp: now,
      workspaceId,
      periodStart: usageEvent.periodStart
        ? formatDateTimeForClickHouse(usageEvent.periodStart)
        : undefined,
      userWorkspaceId: usageEvent.userWorkspaceId ?? '',
      resourceType: usageEvent.resourceType,
      operationType: usageEvent.operationType,
      quantity: usageEvent.quantity,
      unit: usageEvent.unit,
      creditsUsedMicro: usageEvent.creditsUsedMicro,
      resourceId: usageEvent.resourceId ?? '',
      resourceContext: usageEvent.resourceContext ?? '',
      metadata: {},
    }));

    this.clickHouseService.insert('usageEvent', rows).catch((error) => {
      this.logger.error('Failed to write usage events to ClickHouse', error);
    });
  }
}
