import { Injectable, Logger } from '@nestjs/common';

import { type ComposedEmail } from 'src/engine/core-modules/tool/tools/email-tool/types/composed-email.type';
import { MessagingMessageOutboundService } from 'src/modules/messaging/message-outbound-manager/services/messaging-message-outbound.service';
import { type SendMessageResult } from 'src/modules/messaging/message-outbound-manager/types/send-message-result.type';

@Injectable()
export class SendEmailService {
  private readonly logger = new Logger(SendEmailService.name);

  constructor(
    private readonly messageOutboundService: MessagingMessageOutboundService,
  ) {}

  async sendComposedEmail(data: ComposedEmail): Promise<SendMessageResult> {
    return this.messageOutboundService.sendMessage(
      {
        to: data.recipients.to,
        cc: data.recipients.cc.length > 0 ? data.recipients.cc : undefined,
        bcc: data.recipients.bcc.length > 0 ? data.recipients.bcc : undefined,
        subject: data.sanitizedSubject,
        body: data.plainTextBody,
        html: data.sanitizedHtmlBody,
        attachments: data.attachments,
        inReplyTo: data.inReplyTo,
        threadExternalId: data.threadExternalId,
      },
      data.connectedAccount,
    );
  }

  // Bades: persistSentMessage dihapus karena SentMessagePersistenceService
  // bergantung pada person/contact-creation flow. Pengiriman email tetap
  // berfungsi, tetapi pesan terkirim tidak lagi otomatis tersimpan sebagai
  // record (sync messaging akan membawanya masuk saat sinkronisasi
  // berikutnya kalau channel aktif).
  async persistSentMessage(
    _sendResult: SendMessageResult,
    _data: ComposedEmail,
    _workspaceId: string,
  ): Promise<void> {
    this.logger.debug(
      'persistSentMessage no-op (Bades: contact-creation flow dihapus)',
    );
  }
}
