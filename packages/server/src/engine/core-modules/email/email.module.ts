import { type DynamicModule, Global } from '@nestjs/common';

import { EmailDriverFactory } from 'src/engine/core-modules/email/email-driver.factory';
import { EmailSenderService } from 'src/engine/core-modules/email/email-sender.service';
import { EmailService } from 'src/engine/core-modules/email/email.service';
import { BadesConfigModule } from 'src/engine/core-modules/bades-config/bades-config.module';

@Global()
export class EmailModule {
  static forRoot(): DynamicModule {
    return {
      module: EmailModule,
      imports: [BadesConfigModule],
      providers: [EmailDriverFactory, EmailSenderService, EmailService],
      exports: [EmailSenderService, EmailService],
    };
  }
}
