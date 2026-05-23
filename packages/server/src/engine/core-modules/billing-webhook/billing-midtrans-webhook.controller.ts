/* @license Enterprise */

import {
  Body,
  Controller,
  Logger,
  Post,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

import { type Response } from 'express';

import { BillingException } from 'src/engine/core-modules/billing/billing.exception';
import { BillingRestApiExceptionFilter } from 'src/engine/core-modules/billing/filters/billing-api-exception.filter';
import {
  BillingMidtransWebhookService,
  type MidtransNotificationPayload,
} from 'src/engine/core-modules/billing-webhook/services/billing-midtrans-webhook.service';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { PublicEndpointGuard } from 'src/engine/guards/public-endpoint.guard';

/**
 * Controller untuk menerima notifikasi HTTP dari Midtrans.
 *
 * URL: POST /webhooks/midtrans
 *
 * Endpoint ini harus dapat diakses publik oleh server Midtrans.
 * Penting: jangan pakai IP address atau port aneh — gunakan domain resmi.
 */
@Controller()
@UseFilters(BillingRestApiExceptionFilter)
export class BillingMidtransWebhookController {
  protected readonly logger = new Logger(BillingMidtransWebhookController.name);

  constructor(
    private readonly billingMidtransWebhookService: BillingMidtransWebhookService,
  ) {}

  @Post('webhooks/midtrans')
  @UseGuards(PublicEndpointGuard, NoPermissionGuard)
  async handleMidtransNotification(
    @Body() payload: MidtransNotificationPayload,
    @Res() res: Response,
  ) {
    if (!payload?.order_id) {
      this.logger.warn('Notifikasi Midtrans diterima tanpa order_id');
      res.status(400).json({ error: 'order_id wajib ada' }).end();

      return;
    }

    try {
      await this.billingMidtransWebhookService.processNotification(payload);
      res.status(200).json({ status: 'OK' }).end();
    } catch (error) {
      if (error instanceof BillingException) {
        throw error;
      }

      const pesanError =
        error instanceof Error ? error.message : JSON.stringify(error);

      this.logger.error(
        `Error memproses notifikasi Midtrans: orderId=${payload.order_id}`,
        pesanError,
      );

      res.status(500).json({ error: 'Gagal memproses notifikasi' }).end();
    }
  }
}
