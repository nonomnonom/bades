import { Injectable } from '@nestjs/common';

import { isNonEmptyString } from '@sniptt/guards';
import { isDefined } from 'shared/utils';

import { StorageDriverType } from 'src/engine/core-modules/file-storage/interfaces/file-storage.interface';

import { NodeEnvironment } from 'src/engine/core-modules/bades-config/interfaces/node-environment.interface';
import { SupportDriver } from 'src/engine/core-modules/bades-config/interfaces/support.interface';

import { MaintenanceModeService } from 'src/engine/core-modules/admin-panel/maintenance-mode.service';
import { type ClientConfig } from 'src/engine/core-modules/client-config/client-config.entity';
import { DomainServerConfigService } from 'src/engine/core-modules/domain/domain-server-config/services/domain-server-config.service';
import { PUBLIC_FEATURE_FLAGS } from 'src/engine/core-modules/feature-flag/constants/public-feature-flag.const';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

@Injectable()
export class ClientConfigService {
  constructor(
    private badesConfigService: BadesConfigService,
    private domainServerConfigService: DomainServerConfigService,
    private maintenanceModeService: MaintenanceModeService,
  ) {}

  private isCloudflareIntegrationEnabled(): boolean {
    return (
      !!this.badesConfigService.get('CLOUDFLARE_API_KEY') &&
      !!this.badesConfigService.get('CLOUDFLARE_ZONE_ID')
    );
  }

  async getClientConfig(): Promise<ClientConfig> {
    const captchaProvider = this.badesConfigService.get('CAPTCHA_DRIVER');
    const supportDriver = this.badesConfigService.get('SUPPORT_DRIVER');
    const calendarBookingPageId = this.badesConfigService.get(
      'CALENDAR_BOOKING_PAGE_ID',
    );

    // Bades single-model: tidak mengekspos daftar model AI ke front. Model
    // operasional dikunci internal via `load-default-model-preferences.util`.

    const clientConfig: ClientConfig = {
      appVersion: this.badesConfigService.get('APP_VERSION'),
      billing: {
        isBillingEnabled: this.badesConfigService.get('IS_BILLING_ENABLED'),
        billingUrl: this.badesConfigService.get('BILLING_PLAN_REQUIRED_LINK'),
        trialPeriods: [
          {
            duration: this.badesConfigService.get(
              'BILLING_FREE_TRIAL_WITH_CREDIT_CARD_DURATION_IN_DAYS',
            ),
            isCreditCardRequired: true,
          },
          {
            duration: this.badesConfigService.get(
              'BILLING_FREE_TRIAL_WITHOUT_CREDIT_CARD_DURATION_IN_DAYS',
            ),
            isCreditCardRequired: false,
          },
        ],
      },
      authProviders: {
        google: this.badesConfigService.get('AUTH_GOOGLE_ENABLED'),
        magicLink: false,
        password: this.badesConfigService.get('AUTH_PASSWORD_ENABLED'),
        microsoft: this.badesConfigService.get('AUTH_MICROSOFT_ENABLED'),
        sso: [],
      },
      signInPrefilled: this.badesConfigService.get('SIGN_IN_PREFILLED'),
      isMultiWorkspaceEnabled: this.badesConfigService.get(
        'IS_MULTIWORKSPACE_ENABLED',
      ),
      isEmailVerificationRequired: this.badesConfigService.get(
        'IS_EMAIL_VERIFICATION_REQUIRED',
      ),
      defaultSubdomain: this.badesConfigService.get('DEFAULT_SUBDOMAIN'),
      frontDomain: this.domainServerConfigService.getFrontUrl().hostname,
      support: {
        supportDriver: supportDriver ? supportDriver : SupportDriver.NONE,
        supportFrontChatId: this.badesConfigService.get(
          'SUPPORT_FRONT_CHAT_ID',
        ),
      },
      sentry: {
        environment: this.badesConfigService.get('SENTRY_ENVIRONMENT'),
        release: this.badesConfigService.get('APP_VERSION'),
        dsn: this.badesConfigService.get('SENTRY_FRONT_DSN'),
      },
      captcha: {
        provider: captchaProvider ? captchaProvider : undefined,
        siteKey: this.badesConfigService.get('CAPTCHA_SITE_KEY'),
      },
      api: {
        mutationMaximumAffectedRecords: this.badesConfigService.get(
          'MUTATION_MAXIMUM_AFFECTED_RECORDS',
        ),
      },
      isAttachmentPreviewEnabled: this.badesConfigService.get(
        'IS_ATTACHMENT_PREVIEW_ENABLED',
      ),
      analyticsEnabled: this.badesConfigService.get('ANALYTICS_ENABLED'),
      canManageFeatureFlags:
        this.badesConfigService.get('NODE_ENV') ===
          NodeEnvironment.DEVELOPMENT ||
        this.badesConfigService.get('IS_BILLING_ENABLED'),
      publicFeatureFlags: PUBLIC_FEATURE_FLAGS,
      isMicrosoftMessagingEnabled: this.badesConfigService.get(
        'MESSAGING_PROVIDER_MICROSOFT_ENABLED',
      ),
      isMicrosoftCalendarEnabled: this.badesConfigService.get(
        'CALENDAR_PROVIDER_MICROSOFT_ENABLED',
      ),
      isGoogleMessagingEnabled: this.badesConfigService.get(
        'MESSAGING_PROVIDER_GMAIL_ENABLED',
      ),
      isGoogleCalendarEnabled: this.badesConfigService.get(
        'CALENDAR_PROVIDER_GOOGLE_ENABLED',
      ),
      isConfigVariablesInDbEnabled: this.badesConfigService.get(
        'IS_CONFIG_VARIABLES_IN_DB_ENABLED',
      ),
      isImapSmtpCaldavEnabled: this.badesConfigService.get(
        'IS_IMAP_SMTP_CALDAV_ENABLED',
      ),
      isEmailGroupEnabled:
        this.badesConfigService.get('STORAGE_TYPE') ===
          StorageDriverType.S_3 &&
        isNonEmptyString(this.badesConfigService.get('INBOUND_EMAIL_DOMAIN')),
      allowRequestsToFaviconService: this.badesConfigService.get(
        'ALLOW_REQUESTS_TO_FAVICON_SERVICE',
      ),
      calendarBookingPageId: isNonEmptyString(calendarBookingPageId)
        ? calendarBookingPageId
        : undefined,
      isCloudflareIntegrationEnabled: this.isCloudflareIntegrationEnabled(),
      isClickHouseConfigured: !!this.badesConfigService.get('CLICKHOUSE_URL'),
      isWorkspaceSchemaDDLLocked: this.badesConfigService.get(
        'WORKSPACE_SCHEMA_DDL_LOCKED',
      ),
    };

    const maintenanceMode =
      await this.maintenanceModeService.getMaintenanceMode();

    if (isDefined(maintenanceMode)) {
      clientConfig.maintenance = {
        startAt: new Date(maintenanceMode.startAt),
        endAt: new Date(maintenanceMode.endAt),
        link: maintenanceMode.link,
      };
    }

    return clientConfig;
  }
}
