/* @license Enterprise */

import { Injectable, Logger, type OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as crypto from 'crypto';

import { isDefined } from 'shared/utils';
import { IsNull, Repository } from 'typeorm';

import {
  AppTokenEntity,
  AppTokenType,
} from 'src/engine/core-modules/app-token/app-token.entity';
import {
  ENTERPRISE_JWT_DEV_PUBLIC_KEY,
  ENTERPRISE_JWT_PUBLIC_KEY,
} from 'src/engine/core-modules/enterprise/constants/enterprise-public-key.constant';
import {
  type EnterpriseKeyPayload,
  type EnterpriseLicenseInfo,
  type EnterpriseValidityPayload,
} from 'src/engine/core-modules/enterprise/types/enterprise-key-payload.type';
import { NodeEnvironment } from 'src/engine/core-modules/bades-config/interfaces/node-environment.interface';
import {
  ConfigVariableException,
  ConfigVariableExceptionCode,
} from 'src/engine/core-modules/bades-config/bades-config.exception';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

@Injectable()
export class EnterprisePlanService implements OnModuleInit {
  private readonly logger = new Logger(EnterprisePlanService.name);
  private cachedValidityPayload: EnterpriseValidityPayload | null = null;
  private cachedKeyPayload: EnterpriseKeyPayload | null = null;

  constructor(
    private readonly badesConfigService: BadesConfigService,
    @InjectRepository(AppTokenEntity)
    private readonly appTokenRepository: Repository<AppTokenEntity>,
  ) {}

  async onModuleInit() {
    this.refreshKeyPayload();
    await this.loadValidityToken();
  }

  private refreshKeyPayload(): void {
    const enterpriseKey = this.badesConfigService.get('ENTERPRISE_KEY');

    if (!enterpriseKey) {
      this.cachedKeyPayload = null;

      return;
    }

    const payload = this.verifyJwt<EnterpriseKeyPayload>(enterpriseKey);

    this.cachedKeyPayload = payload;
  }

  private async loadValidityToken(): Promise<void> {
    try {
      const dbToken = await this.appTokenRepository.findOne({
        where: {
          type: AppTokenType.EnterpriseValidityToken,
          userId: IsNull(),
          workspaceId: IsNull(),
          revokedAt: IsNull(),
        },
        order: { createdAt: 'DESC' },
      });

      const tokenValue =
        dbToken?.value ??
        this.badesConfigService.get('ENTERPRISE_VALIDITY_TOKEN');

      if (!tokenValue) {
        this.cachedValidityPayload = null;

        return;
      }

      const payload = this.verifyJwt<EnterpriseValidityPayload>(tokenValue);

      if (payload && payload.status === 'valid') {
        this.cachedValidityPayload = payload;
      } else {
        this.cachedValidityPayload = null;
      }
    } catch (error) {
      this.logger.warn(
        `Failed to load validity token: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      this.cachedValidityPayload = null;
    }
  }

  private async saveNewValidityTokenToDb(token: string): Promise<void> {
    const payload = this.verifyJwt<EnterpriseValidityPayload>(token);

    if (!isDefined(payload)) {
      return;
    }

    await this.appTokenRepository.manager.transaction(
      async (transactionalEntityManager) => {
        await transactionalEntityManager.update(
          this.appTokenRepository.target,
          {
            type: AppTokenType.EnterpriseValidityToken,
            userId: IsNull(),
            workspaceId: IsNull(),
            revokedAt: IsNull(),
          },
          { revokedAt: new Date() },
        );

        await transactionalEntityManager.save(this.appTokenRepository.target, {
          type: AppTokenType.EnterpriseValidityToken,
          value: token,
          userId: null,
          workspaceId: null,
          expiresAt: new Date(payload.exp * 1000),
        });
      },
    );
  }

  hasValidSignedEnterpriseKey(): boolean {
    this.refreshKeyPayload();
    return isDefined(this.cachedKeyPayload);
  }

  hasValidEnterpriseValidityToken(): boolean {
    if (isDefined(this.cachedValidityPayload)) {
      const now = Math.floor(Date.now() / 1000);

      return this.cachedValidityPayload.exp > now;
    }

    return false;
  }

  hasValidEnterpriseKey(): boolean {
    return this.hasValidSignedEnterpriseKey() || this.checkLegacyKey();
  }

  isValid(): boolean {
    return this.hasValidEnterpriseValidityToken();
  }

  private checkLegacyKey(): boolean {
    // temporary
    return isDefined(this.badesConfigService.get('ENTERPRISE_KEY'));
  }

  isValidEnterpriseKeyFormat(key: string): boolean {
    return this.verifyJwt<EnterpriseKeyPayload>(key) !== null;
  }

  async getLicenseInfo(): Promise<EnterpriseLicenseInfo> {
    this.refreshKeyPayload();
    await this.loadValidityToken();

    if (isDefined(this.cachedValidityPayload)) {
      const now = Math.floor(Date.now() / 1000);

      return {
        isValid: this.cachedValidityPayload.exp > now,
        licensee: this.cachedKeyPayload?.licensee ?? null,
        expiresAt: new Date(this.cachedValidityPayload.exp * 1000),
        subscriptionId: this.cachedValidityPayload.sub,
      };
    }

    return {
      isValid: false,
      licensee: null,
      expiresAt: null,
      subscriptionId: null,
    };
  }

  async setEnterpriseKey(enterpriseKey: string): Promise<void> {
    try {
      await this.badesConfigService.set('ENTERPRISE_KEY', enterpriseKey);
    } catch (error) {
      if (
        error instanceof ConfigVariableException &&
        error.code === ConfigVariableExceptionCode.DATABASE_CONFIG_DISABLED
      ) {
        throw new ConfigVariableException(
          'IS_CONFIG_VARIABLES_IN_DB_ENABLED adalah false di server Anda. ' +
            'Silakan tambahkan ENTERPRISE_KEY ke file .env secara manual.',
          ConfigVariableExceptionCode.DATABASE_CONFIG_DISABLED,
        );
      }

      throw error;
    }
  }

  // Validasi token lisensi dari otoritas internal Bades; dipanggil oleh cron
  // dan dapat digunakan ulang saat kunci diganti secara manual.
  async refreshValidityToken(): Promise<boolean> {
    const enterpriseKey = this.badesConfigService.get('ENTERPRISE_KEY');

    if (!enterpriseKey) {
      this.logger.warn(
        'Tidak ada ENTERPRISE_KEY, skip refresh token validitas',
      );

      return false;
    }

    this.refreshKeyPayload();

    if (!isDefined(this.cachedKeyPayload)) {
      this.logger.warn(
        'ENTERPRISE_KEY bukan JWT bertanda tangan valid, skip refresh',
      );

      return false;
    }

    const apiUrl = this.badesConfigService.get('ENTERPRISE_API_URL');

    if (!apiUrl) {
      this.logger.warn(
        'ENTERPRISE_API_URL tidak dikonfigurasi, skip refresh token validitas',
      );

      return false;
    }

    const validateUrl = `${apiUrl}/validate`;

    try {
      const response = await fetch(validateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enterpriseKey }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        this.logger.warn(
          `Refresh token validitas gagal dengan status ${response.status}: ${errorData.error ?? 'Unknown error'}`,
        );

        return false;
      }

      const data = await response.json();

      if (!data.validityToken) {
        this.logger.warn('Respons refresh tidak memiliki validityToken');

        return false;
      }

      await this.saveNewValidityTokenToDb(data.validityToken);
      await this.loadValidityToken();

      this.logger.log('Token validitas berhasil di-refresh');

      return true;
    } catch (error) {
      this.logger.warn(
        `Refresh token validitas gagal: ${error instanceof Error ? error.message : 'Network error'}. Token validitas yang ada tetap berlaku hingga kedaluwarsa.`,
      );

      return false;
    }
  }

  // In development and Jest integration tests, try both keys so production keys
  // work locally
  private getPublicKeysToTry(): string[] {
    const nodeEnv = this.badesConfigService.get('NODE_ENV');

    if (
      nodeEnv === NodeEnvironment.DEVELOPMENT ||
      nodeEnv === NodeEnvironment.TEST
    ) {
      return [ENTERPRISE_JWT_PUBLIC_KEY, ENTERPRISE_JWT_DEV_PUBLIC_KEY];
    }

    return [ENTERPRISE_JWT_PUBLIC_KEY];
  }

  private verifyJwt<T extends Record<string, unknown>>(
    token: string,
  ): T | null {
    try {
      const parts = token.split('.');

      if (parts.length !== 3) {
        return null;
      }

      const [encodedHeader, encodedPayload, signature] = parts;
      const signingInput = `${encodedHeader}.${encodedPayload}`;

      const signatureBuffer = Buffer.from(
        signature.replace(/-/g, '+').replace(/_/g, '/') +
          '='.repeat((4 - (signature.length % 4)) % 4),
        'base64',
      );

      const publicKeys = this.getPublicKeysToTry();

      for (const publicKey of publicKeys) {
        const isValid = crypto.verify(
          'sha256',
          Buffer.from(signingInput),
          {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          signatureBuffer,
        );

        if (isValid) {
          const payloadStr = Buffer.from(
            encodedPayload.replace(/-/g, '+').replace(/_/g, '/') +
              '='.repeat((4 - (encodedPayload.length % 4)) % 4),
            'base64',
          ).toString('utf-8');

          return JSON.parse(payloadStr) as T;
        }
      }

      return null;
    } catch {
      return null;
    }
  }
}
