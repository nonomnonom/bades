/* @license Enterprise */

import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { BillingException } from 'src/engine/core-modules/billing/billing.exception';
import { BillingMidtransTransactionEntity } from 'src/engine/core-modules/billing/entities/billing-midtrans-transaction.entity';
import { MidtransSDKMockService } from 'src/engine/core-modules/billing/midtrans/midtrans-sdk/mocks/midtrans-sdk-mock.service';
import { MidtransSDKService } from 'src/engine/core-modules/billing/midtrans/midtrans-sdk/services/midtrans-sdk.service';
import { MidtransSnapService } from 'src/engine/core-modules/billing/midtrans/services/midtrans-snap.service';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

describe('MidtransSnapService', () => {
  let service: MidtransSnapService;
  let repositoryMock: jest.Mocked<{ save: jest.Mock; findOne: jest.Mock }>;

  const configMidtransAktif = {
    get: jest.fn((key: string) => {
      const config: Record<string, unknown> = {
        IS_BILLING_ENABLED: true,
        MIDTRANS_SERVER_KEY: 'SB-Mid-server-test',
        MIDTRANS_CLIENT_KEY: 'SB-Mid-client-test',
        MIDTRANS_IS_PRODUCTION: false,
      };

      return config[key];
    }),
  };

  const configMidtransNonaktif = {
    get: jest.fn((key: string) => {
      const config: Record<string, unknown> = {
        IS_BILLING_ENABLED: false,
      };

      return config[key];
    }),
  };

  beforeEach(async () => {
    repositoryMock = {
      save: jest.fn().mockResolvedValue({}),
      findOne: jest.fn().mockResolvedValue(null),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MidtransSnapService,
        {
          provide: BadesConfigService,
          useValue: configMidtransAktif,
        },
        {
          provide: MidtransSDKService,
          useClass: MidtransSDKMockService,
        },
        {
          provide: getRepositoryToken(BillingMidtransTransactionEntity),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    service = module.get<MidtransSnapService>(MidtransSnapService);
  });

  describe('createSnapTransaction', () => {
    it('mengembalikan snapToken dan snapRedirectUrl saat Midtrans aktif', async () => {
      const hasil = await service.createSnapTransaction({
        workspaceId: 'workspace-uuid-123',
        grossAmount: 100000,
        transactionType: 'TOP_UP_CREDIT',
        customerEmail: 'perangkat@desa.id',
        itemName: 'Top Up Kredit 100.000',
      });

      expect(hasil.snapToken).toBe('mock-snap-token');
      expect(hasil.snapRedirectUrl).toContain('mock-snap-token');
      expect(hasil.orderId).toContain('bades-workspace-uuid-123');
    });

    it('menyimpan transaksi ke database setelah Snap dibuat', async () => {
      await service.createSnapTransaction({
        workspaceId: 'workspace-uuid-123',
        grossAmount: 50000,
        transactionType: 'MONTHLY_BILLING',
        itemName: 'Tagihan Bulanan Bades',
      });

      expect(repositoryMock.save).toHaveBeenCalledTimes(1);

      const argSave = repositoryMock.save.mock.calls[0][0];

      expect(argSave.workspaceId).toBe('workspace-uuid-123');
      expect(argSave.grossAmount).toBe(50000);
      expect(argSave.transactionType).toBe('MONTHLY_BILLING');
      expect(argSave.transactionStatus).toBe('pending');
    });

    it('orderId mengikuti format bades-{workspaceId}-{timestamp}', async () => {
      const hasil = await service.createSnapTransaction({
        workspaceId: 'ws-test',
        grossAmount: 75000,
        transactionType: 'TOP_UP_CREDIT',
        itemName: 'Test Item',
      });

      expect(hasil.orderId).toMatch(/^bades-ws-test-\d+$/);
    });
  });

  describe('createSnapTransaction saat Midtrans nonaktif', () => {
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          MidtransSnapService,
          {
            provide: BadesConfigService,
            useValue: configMidtransNonaktif,
          },
          {
            provide: MidtransSDKService,
            useClass: MidtransSDKMockService,
          },
          {
            provide: getRepositoryToken(BillingMidtransTransactionEntity),
            useValue: repositoryMock,
          },
        ],
      }).compile();

      service = module.get<MidtransSnapService>(MidtransSnapService);
    });

    it('melempar BillingException saat Midtrans tidak dikonfigurasi', async () => {
      await expect(
        service.createSnapTransaction({
          workspaceId: 'workspace-uuid-123',
          grossAmount: 100000,
          transactionType: 'TOP_UP_CREDIT',
          itemName: 'Test',
        }),
      ).rejects.toThrow(BillingException);
    });
  });
});
