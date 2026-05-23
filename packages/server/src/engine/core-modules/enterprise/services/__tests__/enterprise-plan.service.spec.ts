/* @license Enterprise */

import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AppTokenEntity } from 'src/engine/core-modules/app-token/app-token.entity';
import { EnterprisePlanService } from 'src/engine/core-modules/enterprise/services/enterprise-plan.service';
import { NodeEnvironment } from 'src/engine/core-modules/bades-config/interfaces/node-environment.interface';
import {
  ConfigVariableException,
  ConfigVariableExceptionCode,
} from 'src/engine/core-modules/bades-config/bades-config.exception';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

const mockCryptoVerify = jest.fn();

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  verify: (...args: unknown[]) => mockCryptoVerify(...args),
}));

const createFakeJwt = (payload: Record<string, unknown>): string => {
  const header = Buffer.from(
    JSON.stringify({ alg: 'RS256', typ: 'JWT' }),
  ).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = Buffer.from('fake-signature').toString('base64url');

  return `${header}.${body}.${signature}`;
};

const MOCK_API_URL = 'https://enterprise.example.com';
const FUTURE_TIMESTAMP = Math.floor(Date.now() / 1000) + 3600;
const PAST_TIMESTAMP = Math.floor(Date.now() / 1000) - 3600;

const MOCK_KEY_PAYLOAD = {
  sub: 'sub-123',
  licensee: 'ACME Corp',
  iat: 1000,
};

const MOCK_VALIDITY_PAYLOAD = {
  sub: 'sub-123',
  status: 'valid',
  iat: 1000,
  exp: FUTURE_TIMESTAMP,
};

const MOCK_EXPIRED_VALIDITY_PAYLOAD = {
  sub: 'sub-123',
  status: 'valid',
  iat: 1000,
  exp: PAST_TIMESTAMP,
};

describe('EnterprisePlanService', () => {
  let service: EnterprisePlanService;

  const configGetMock = jest.fn();
  const configSetMock = jest.fn();
  const appTokenFindOneMock = jest.fn();
  const transactionMock = jest.fn();
  const fetchMock = jest.fn();

  let originalFetch: typeof global.fetch;

  const setupEnterpriseKey = (key?: string) => {
    configGetMock.mockImplementation((configKey: string) => {
      if (configKey === 'ENTERPRISE_KEY') return key;
      if (configKey === 'ENTERPRISE_API_URL') return MOCK_API_URL;

      return undefined;
    });
  };

  const setupValidState = async (
    overrides: {
      keyPayload?: Record<string, unknown>;
      validityPayload?: Record<string, unknown>;
      cryptoVerifyResult?: boolean;
    } = {},
  ) => {
    const {
      keyPayload = MOCK_KEY_PAYLOAD,
      validityPayload = MOCK_VALIDITY_PAYLOAD,
      cryptoVerifyResult = true,
    } = overrides;

    const fakeKey = createFakeJwt(keyPayload);
    const fakeValidityToken = createFakeJwt(validityPayload);

    setupEnterpriseKey(fakeKey);
    mockCryptoVerify.mockReturnValue(cryptoVerifyResult);
    appTokenFindOneMock.mockResolvedValue({ value: fakeValidityToken });

    await service.onModuleInit();
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    originalFetch = global.fetch;
    global.fetch = fetchMock as unknown as typeof fetch;

    configGetMock.mockImplementation((key: string) => {
      if (key === 'ENTERPRISE_API_URL') return MOCK_API_URL;

      return undefined;
    });

    appTokenFindOneMock.mockResolvedValue(null);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnterprisePlanService,
        {
          provide: BadesConfigService,
          useValue: {
            get: configGetMock,
            set: configSetMock,
          },
        },
        {
          provide: getRepositoryToken(AppTokenEntity),
          useValue: {
            findOne: appTokenFindOneMock,
            target: AppTokenEntity,
            manager: {
              transaction: transactionMock,
            },
          },
        },
      ],
    }).compile();

    service = module.get<EnterprisePlanService>(EnterprisePlanService);
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should populate caches when enterprise key and validity token exist', async () => {
      await setupValidState();

      expect(service.hasValidSignedEnterpriseKey()).toBe(true);
      expect(service.hasValidEnterpriseValidityToken()).toBe(true);
    });

    it('should handle missing enterprise key', async () => {
      setupEnterpriseKey(undefined);
      appTokenFindOneMock.mockResolvedValue(null);

      await service.onModuleInit();

      expect(service.hasValidSignedEnterpriseKey()).toBe(false);
      expect(service.hasValidEnterpriseValidityToken()).toBe(false);
    });

    it('should handle DB error when loading validity token', async () => {
      setupEnterpriseKey(createFakeJwt(MOCK_KEY_PAYLOAD));
      mockCryptoVerify.mockReturnValue(true);
      appTokenFindOneMock.mockRejectedValue(new Error('DB connection failed'));

      await service.onModuleInit();

      expect(service.hasValidSignedEnterpriseKey()).toBe(true);
      expect(service.hasValidEnterpriseValidityToken()).toBe(false);
    });

    it('should fall back to ENTERPRISE_VALIDITY_TOKEN config when DB has no token', async () => {
      const fakeKey = createFakeJwt(MOCK_KEY_PAYLOAD);
      const fakeValidityToken = createFakeJwt(MOCK_VALIDITY_PAYLOAD);

      configGetMock.mockImplementation((key: string) => {
        if (key === 'ENTERPRISE_KEY') return fakeKey;
        if (key === 'ENTERPRISE_API_URL') return MOCK_API_URL;
        if (key === 'ENTERPRISE_VALIDITY_TOKEN') return fakeValidityToken;

        return undefined;
      });
      mockCryptoVerify.mockReturnValue(true);
      appTokenFindOneMock.mockResolvedValue(null);

      await service.onModuleInit();

      expect(service.hasValidEnterpriseValidityToken()).toBe(true);
    });

    it('should prefer DB token over ENTERPRISE_VALIDITY_TOKEN config', async () => {
      const fakeKey = createFakeJwt(MOCK_KEY_PAYLOAD);
      const dbToken = createFakeJwt(MOCK_VALIDITY_PAYLOAD);
      const envToken = createFakeJwt(MOCK_EXPIRED_VALIDITY_PAYLOAD);

      configGetMock.mockImplementation((key: string) => {
        if (key === 'ENTERPRISE_KEY') return fakeKey;
        if (key === 'ENTERPRISE_API_URL') return MOCK_API_URL;
        if (key === 'ENTERPRISE_VALIDITY_TOKEN') return envToken;

        return undefined;
      });
      mockCryptoVerify.mockReturnValue(true);
      appTokenFindOneMock.mockResolvedValue({ value: dbToken });

      await service.onModuleInit();

      expect(service.hasValidEnterpriseValidityToken()).toBe(true);
    });

    it('should reject validity token with non-valid status', async () => {
      const invalidStatusPayload = {
        ...MOCK_VALIDITY_PAYLOAD,
        status: 'revoked',
      };

      setupEnterpriseKey(createFakeJwt(MOCK_KEY_PAYLOAD));
      mockCryptoVerify.mockReturnValue(true);
      appTokenFindOneMock.mockResolvedValue({
        value: createFakeJwt(invalidStatusPayload),
      });

      await service.onModuleInit();

      expect(service.hasValidEnterpriseValidityToken()).toBe(false);
    });
  });

  describe('hasValidSignedEnterpriseKey', () => {
    it('should return false when no enterprise key is configured', async () => {
      setupEnterpriseKey(undefined);
      await service.onModuleInit();

      expect(service.hasValidSignedEnterpriseKey()).toBe(false);
    });

    it('should return true when key has valid signature', async () => {
      setupEnterpriseKey(createFakeJwt(MOCK_KEY_PAYLOAD));
      mockCryptoVerify.mockReturnValue(true);
      await service.onModuleInit();

      expect(service.hasValidSignedEnterpriseKey()).toBe(true);
    });

    it('should return false when key has invalid signature', async () => {
      setupEnterpriseKey(createFakeJwt(MOCK_KEY_PAYLOAD));
      mockCryptoVerify.mockReturnValue(false);
      await service.onModuleInit();

      expect(service.hasValidSignedEnterpriseKey()).toBe(false);
    });

    it('should return false when key is not a valid JWT format', async () => {
      setupEnterpriseKey('not-a-jwt');
      await service.onModuleInit();

      expect(service.hasValidSignedEnterpriseKey()).toBe(false);
    });
  });

  describe('hasValidEnterpriseValidityToken', () => {
    it('should return false when no validity token exists', async () => {
      setupEnterpriseKey(undefined);
      appTokenFindOneMock.mockResolvedValue(null);
      await service.onModuleInit();

      expect(service.hasValidEnterpriseValidityToken()).toBe(false);
    });

    it('should return true when validity token is valid and not expired', async () => {
      await setupValidState();

      expect(service.hasValidEnterpriseValidityToken()).toBe(true);
    });

    it('should return false when validity token is expired', async () => {
      await setupValidState({
        validityPayload: MOCK_EXPIRED_VALIDITY_PAYLOAD,
      });

      expect(service.hasValidEnterpriseValidityToken()).toBe(false);
    });
  });

  // hasValidEnterpriseKey now means "has any ENTERPRISE_KEY configured"
  describe('hasValidEnterpriseKey', () => {
    it('should return true when signed enterprise key is valid', async () => {
      await setupValidState();

      expect(service.hasValidEnterpriseKey()).toBe(true);
    });

    it('should return true with unsigned legacy key', async () => {
      setupEnterpriseKey('some-legacy-key');
      mockCryptoVerify.mockReturnValue(false);
      appTokenFindOneMock.mockResolvedValue(null);
      await service.onModuleInit();

      expect(service.hasValidEnterpriseKey()).toBe(true);
    });

    it('should return false when no key is configured', async () => {
      setupEnterpriseKey(undefined);
      await service.onModuleInit();

      expect(service.hasValidEnterpriseKey()).toBe(false);
    });
  });

  describe('isValid', () => {
    it('should return true when validity token is valid', async () => {
      await setupValidState();

      expect(service.isValid()).toBe(true);
    });

    it('should return false with unsigned legacy key', async () => {
      setupEnterpriseKey('some-legacy-key');
      mockCryptoVerify.mockReturnValue(false);
      appTokenFindOneMock.mockResolvedValue(null);
      await service.onModuleInit();

      expect(service.isValid()).toBe(false);
    });

    it('should return false when no key or token exists', async () => {
      setupEnterpriseKey(undefined);
      appTokenFindOneMock.mockResolvedValue(null);
      await service.onModuleInit();

      expect(service.isValid()).toBe(false);
    });
  });

  describe('isValidEnterpriseKeyFormat', () => {
    it('should return true for valid JWT format', () => {
      mockCryptoVerify.mockReturnValue(true);
      const validKey = createFakeJwt(MOCK_KEY_PAYLOAD);

      expect(service.isValidEnterpriseKeyFormat(validKey)).toBe(true);
    });

    it('should return false for invalid JWT format', () => {
      expect(service.isValidEnterpriseKeyFormat('not-a-jwt')).toBe(false);
    });

    it('should return false when signature verification fails', () => {
      mockCryptoVerify.mockReturnValue(false);
      const invalidKey = createFakeJwt(MOCK_KEY_PAYLOAD);

      expect(service.isValidEnterpriseKeyFormat(invalidKey)).toBe(false);
    });

    it('should accept production key when NODE_ENV is development', () => {
      configGetMock.mockImplementation((key: string) => {
        if (key === 'NODE_ENV') return NodeEnvironment.DEVELOPMENT;
        if (key === 'ENTERPRISE_API_URL') return MOCK_API_URL;

        return undefined;
      });
      mockCryptoVerify.mockReturnValueOnce(false).mockReturnValueOnce(true);
      const productionKey = createFakeJwt(MOCK_KEY_PAYLOAD);

      expect(service.isValidEnterpriseKeyFormat(productionKey)).toBe(true);
      expect(mockCryptoVerify).toHaveBeenCalledTimes(2);
    });
  });

  describe('getLicenseInfo', () => {
    it('should return valid license info when validity token exists', async () => {
      await setupValidState();

      const licenseInfo = await service.getLicenseInfo();

      expect(licenseInfo).toEqual({
        isValid: true,
        licensee: 'ACME Corp',
        expiresAt: new Date(FUTURE_TIMESTAMP * 1000),
        subscriptionId: 'sub-123',
      });
    });

    it('should return expired license info when validity token is expired', async () => {
      await setupValidState({
        validityPayload: MOCK_EXPIRED_VALIDITY_PAYLOAD,
      });

      const licenseInfo = await service.getLicenseInfo();

      expect(licenseInfo).toEqual({
        isValid: false,
        licensee: 'ACME Corp',
        expiresAt: new Date(PAST_TIMESTAMP * 1000),
        subscriptionId: 'sub-123',
      });
    });

    it('should return invalid license info when only unsigned legacy key exists', async () => {
      setupEnterpriseKey('some-legacy-key');
      mockCryptoVerify.mockReturnValue(false);
      appTokenFindOneMock.mockResolvedValue(null);

      const licenseInfo = await service.getLicenseInfo();

      expect(licenseInfo).toEqual({
        isValid: false,
        licensee: null,
        expiresAt: null,
        subscriptionId: null,
      });
    });

    it('should return invalid license info when no key exists', async () => {
      setupEnterpriseKey(undefined);
      appTokenFindOneMock.mockResolvedValue(null);

      const licenseInfo = await service.getLicenseInfo();

      expect(licenseInfo).toEqual({
        isValid: false,
        licensee: null,
        expiresAt: null,
        subscriptionId: null,
      });
    });
  });

  describe('setEnterpriseKey', () => {
    it('should set the enterprise key via config service', async () => {
      configSetMock.mockResolvedValue(undefined);

      await service.setEnterpriseKey('new-enterprise-key');

      expect(configSetMock).toHaveBeenCalledWith(
        'ENTERPRISE_KEY',
        'new-enterprise-key',
      );
    });

    it('should throw specific error when DB config is disabled', async () => {
      configSetMock.mockRejectedValue(
        new ConfigVariableException(
          'Database config disabled',
          ConfigVariableExceptionCode.DATABASE_CONFIG_DISABLED,
        ),
      );

      await expect(service.setEnterpriseKey('key')).rejects.toThrow(
        'IS_CONFIG_VARIABLES_IN_DB_ENABLED adalah false di server Anda',
      );
    });

    it('should re-throw other errors', async () => {
      configSetMock.mockRejectedValue(new Error('Unexpected error'));

      await expect(service.setEnterpriseKey('key')).rejects.toThrow(
        'Unexpected error',
      );
    });
  });

  describe('refreshValidityToken', () => {
    it('should return false when no enterprise key is configured', async () => {
      setupEnterpriseKey(undefined);

      const result = await service.refreshValidityToken();

      expect(result).toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should return false when key is not a valid signed JWT', async () => {
      setupEnterpriseKey('not-a-valid-jwt');

      const result = await service.refreshValidityToken();

      expect(result).toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should return false when ENTERPRISE_API_URL is not configured', async () => {
      const fakeKey = createFakeJwt(MOCK_KEY_PAYLOAD);

      configGetMock.mockImplementation((key: string) => {
        if (key === 'ENTERPRISE_KEY') return fakeKey;

        return undefined;
      });
      mockCryptoVerify.mockReturnValue(true);

      const result = await service.refreshValidityToken();

      expect(result).toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should refresh and return true when API call succeeds', async () => {
      const fakeKey = createFakeJwt(MOCK_KEY_PAYLOAD);
      const fakeValidityToken = createFakeJwt(MOCK_VALIDITY_PAYLOAD);

      setupEnterpriseKey(fakeKey);
      mockCryptoVerify.mockReturnValue(true);

      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ validityToken: fakeValidityToken }),
      });

      transactionMock.mockImplementation(
        async (callback: (manager: Record<string, jest.Mock>) => void) => {
          await callback({
            update: jest.fn(),
            save: jest.fn(),
          });
        },
      );

      appTokenFindOneMock.mockResolvedValue({ value: fakeValidityToken });

      const result = await service.refreshValidityToken();

      expect(result).toBe(true);
      expect(fetchMock).toHaveBeenCalledWith(`${MOCK_API_URL}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enterpriseKey: fakeKey }),
      });
    });

    it('should return false when API returns non-OK response', async () => {
      const fakeKey = createFakeJwt(MOCK_KEY_PAYLOAD);

      setupEnterpriseKey(fakeKey);
      mockCryptoVerify.mockReturnValue(true);

      fetchMock.mockResolvedValue({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ error: 'Unauthorized' }),
      });

      const result = await service.refreshValidityToken();

      expect(result).toBe(false);
    });

    it('should return false when API response is missing validityToken', async () => {
      const fakeKey = createFakeJwt(MOCK_KEY_PAYLOAD);

      setupEnterpriseKey(fakeKey);
      mockCryptoVerify.mockReturnValue(true);

      fetchMock.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      const result = await service.refreshValidityToken();

      expect(result).toBe(false);
    });

    it('should return false on network error', async () => {
      const fakeKey = createFakeJwt(MOCK_KEY_PAYLOAD);

      setupEnterpriseKey(fakeKey);
      mockCryptoVerify.mockReturnValue(true);

      fetchMock.mockRejectedValue(new Error('Network error'));

      const result = await service.refreshValidityToken();

      expect(result).toBe(false);
    });
  });
});
