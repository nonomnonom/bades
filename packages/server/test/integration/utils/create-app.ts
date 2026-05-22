import { APP_FILTER } from '@nestjs/core';
import { type NestExpressApplication } from '@nestjs/platform-express';
import {
  Test,
  type TestingModule,
  type TestingModuleBuilder,
} from '@nestjs/testing';

import bytes from 'bytes';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

import { AppModule } from 'src/app.module';
import { settings } from 'src/engine/constants/settings';
import { MidtransSDKMockService } from 'src/engine/core-modules/billing/midtrans/midtrans-sdk/mocks/midtrans-sdk-mock.service';
import { MidtransSDKService } from 'src/engine/core-modules/billing/midtrans/midtrans-sdk/services/midtrans-sdk.service';
import { CaptchaDriverFactory } from 'src/engine/core-modules/captcha/captcha-driver.factory';
import { ExceptionHandlerService } from 'src/engine/core-modules/exception-handler/exception-handler.service';
import { ExceptionHandlerMockService } from 'src/engine/core-modules/exception-handler/mocks/exception-handler-mock.service';
import { MockedUnhandledExceptionFilter } from 'src/engine/core-modules/exception-handler/mocks/mock-unhandled-exception.filter';
import { SyncDriver } from 'src/engine/core-modules/message-queue/drivers/sync.driver';
import { JobsModule } from 'src/engine/core-modules/message-queue/jobs.module';
import { QUEUE_DRIVER } from 'src/engine/core-modules/message-queue/message-queue.constants';
import { MessageQueueModule } from 'src/engine/core-modules/message-queue/message-queue.module';

interface TestingModuleCreatePreHook {
  (moduleBuilder: TestingModuleBuilder): TestingModuleBuilder;
}

/**
 * Hook for adding items to nest application
 */
export type TestingAppCreatePreHook = (
  app: NestExpressApplication,
) => Promise<void>;

// Shared SyncDriver instance for all queues in tests
// This enables synchronous processing of jobs during integration tests
const syncDriver = new SyncDriver();

/**
 * Sets basic integration testing module of app
 */
export const createApp = async (
  config: {
    moduleBuilderHook?: TestingModuleCreatePreHook;
    appInitHook?: TestingAppCreatePreHook;
  } = {},
): Promise<NestExpressApplication> => {
  const midtransSDKMockService = new MidtransSDKMockService();
  const mockExceptionHandlerService = new ExceptionHandlerMockService();
  let moduleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [AppModule, JobsModule, MessageQueueModule.registerExplorer()],
    providers: [
      {
        provide: APP_FILTER,
        useClass: MockedUnhandledExceptionFilter,
      },
    ],
  })
    .overrideProvider(MidtransSDKService)
    .useValue(midtransSDKMockService)
    .overrideProvider(ExceptionHandlerService)
    .useValue(mockExceptionHandlerService)
    .overrideProvider(CaptchaDriverFactory)
    .useValue({
      getCurrentDriver: () => ({
        validate: async () => ({ success: true }),
      }),
    })
    .overrideProvider(QUEUE_DRIVER)
    .useValue(syncDriver);

  if (config.moduleBuilderHook) {
    moduleBuilder = config.moduleBuilderHook(moduleBuilder);
  }

  const moduleFixture: TestingModule = await moduleBuilder.compile();

  const app = moduleFixture.createNestApplication<NestExpressApplication>({
    rawBody: true,
    cors: true,
  });

  app.use(
    '/graphql',
    graphqlUploadExpress({
      maxFieldSize: bytes(settings.storage.maxFileSize)!,
      maxFiles: 10,
    }),
  );

  app.use(
    '/metadata',
    graphqlUploadExpress({
      maxFieldSize: bytes(settings.storage.maxFileSize)!,
      maxFiles: 10,
    }),
  );

  if (config.appInitHook) {
    await config.appInitHook(app);
  }

  await app.init();

  return app;
};
