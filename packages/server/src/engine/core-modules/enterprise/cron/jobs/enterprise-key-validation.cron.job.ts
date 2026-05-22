/* @license Enterprise */

import { Injectable, Logger } from '@nestjs/common';

import { SentryCronMonitor } from 'src/engine/core-modules/cron/sentry-cron-monitor.decorator';
import { ENTERPRISE_KEY_VALIDATION_CRON_PATTERN } from 'src/engine/core-modules/enterprise/constants/enterprise-key-validation-cron-pattern.constant';
import { EnterprisePlanService } from 'src/engine/core-modules/enterprise/services/enterprise-plan.service';
import { Process } from 'src/engine/core-modules/message-queue/decorators/process.decorator';
import { Processor } from 'src/engine/core-modules/message-queue/decorators/processor.decorator';
import { MessageQueue } from 'src/engine/core-modules/message-queue/message-queue.constants';

@Injectable()
@Processor(MessageQueue.cronQueue)
export class EnterpriseKeyValidationCronJob {
  private readonly logger = new Logger(EnterpriseKeyValidationCronJob.name);

  constructor(
    private readonly enterprisePlanService: EnterprisePlanService,
  ) {}

  @Process(EnterpriseKeyValidationCronJob.name)
  @SentryCronMonitor(
    EnterpriseKeyValidationCronJob.name,
    ENTERPRISE_KEY_VALIDATION_CRON_PATTERN,
  )
  async handle(): Promise<void> {
    this.logger.log('Memulai refresh token validitas enterprise...');

    const refreshSuccess =
      await this.enterprisePlanService.refreshValidityToken();

    if (refreshSuccess) {
      this.logger.log('Token validitas enterprise berhasil di-refresh');
    } else {
      this.logger.warn(
        'Refresh token validitas enterprise tidak berhasil. ' +
          'Token yang ada tetap berlaku hingga kedaluwarsa.',
      );
    }
  }
}
