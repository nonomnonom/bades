import { Injectable } from '@nestjs/common';

import { type CaptchaDriver } from 'src/engine/core-modules/captcha/drivers/interfaces/captcha-driver.interface';

import { GoogleRecaptchaDriver } from 'src/engine/core-modules/captcha/drivers/google-recaptcha.driver';
import { TurnstileDriver } from 'src/engine/core-modules/captcha/drivers/turnstile.driver';
import { CaptchaDriverType } from 'src/engine/core-modules/captcha/interfaces';
import { SecureHttpClientService } from 'src/engine/core-modules/secure-http-client/secure-http-client.service';
import { DriverFactoryBase } from 'src/engine/core-modules/bades-config/dynamic-factory.base';
import { ConfigVariablesGroup } from 'src/engine/core-modules/bades-config/enums/config-variables-group.enum';
import { ConfigGroupHashService } from 'src/engine/core-modules/bades-config/services/config-group-hash.service';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

@Injectable()
export class CaptchaDriverFactory extends DriverFactoryBase<CaptchaDriver | null> {
  constructor(
    badesConfigService: BadesConfigService,
    configGroupHashService: ConfigGroupHashService,
    private readonly secureHttpClientService: SecureHttpClientService,
  ) {
    super(badesConfigService, configGroupHashService);
  }

  protected buildConfigKey(): string {
    const driver = this.badesConfigService.get('CAPTCHA_DRIVER');

    if (!driver) {
      return 'disabled';
    }

    return `${driver}|${this.configGroupHashService.computeHash(ConfigVariablesGroup.CAPTCHA_CONFIG)}`;
  }

  protected createDriver(): CaptchaDriver | null {
    const driver = this.badesConfigService.get('CAPTCHA_DRIVER');
    const siteKey = this.badesConfigService.get('CAPTCHA_SITE_KEY');
    const secretKey = this.badesConfigService.get('CAPTCHA_SECRET_KEY');

    if (!driver) {
      return null;
    }

    if (!siteKey || !secretKey) {
      throw new Error('Driver captcha memerlukan site key dan secret key');
    }

    const captchaOptions = { siteKey, secretKey };

    switch (driver) {
      case CaptchaDriverType.GOOGLE_RECAPTCHA:
        return new GoogleRecaptchaDriver(
          captchaOptions,
          this.secureHttpClientService.getHttpClient({
            baseURL: 'https://www.google.com/recaptcha/api/siteverify',
          }),
        );

      case CaptchaDriverType.TURNSTILE:
        return new TurnstileDriver(
          captchaOptions,
          this.secureHttpClientService.getHttpClient({
            baseURL:
              'https://challenges.cloudflare.com/turnstile/v0/siteverify',
          }),
        );

      default:
        throw new Error(`Tipe driver captcha tidak valid: ${driver}`);
    }
  }

  getCurrentDriver(): CaptchaDriver | null {
    const driver = this.badesConfigService.get('CAPTCHA_DRIVER');

    if (!driver) {
      return null;
    }

    return super.getCurrentDriver();
  }
}
