import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { type Request, type Response } from 'express';

import { AppTokenEntity } from 'src/engine/core-modules/app-token/app-token.entity';
import {
  AuthException,
  AuthExceptionCode,
} from 'src/engine/core-modules/auth/auth.exception';
import { AccessTokenService } from 'src/engine/core-modules/auth/token/services/access-token.service';
import { ExceptionHandlerService } from 'src/engine/core-modules/exception-handler/exception-handler.service';
import { JwtWrapperService } from 'src/engine/core-modules/jwt/services/jwt-wrapper.service';
import { UserEntity } from 'src/engine/core-modules/user/user.entity';
import { WorkspaceManyOrAllFlatEntityMapsCacheService } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service';
import { WorkspaceCacheStorageService } from 'src/engine/workspace-cache-storage/workspace-cache-storage.service';

import { MiddlewareService } from './middleware.service';

describe('MiddlewareService CORS headers', () => {
  let service: MiddlewareService;
  const originalFrontendUrl = process.env.FRONTEND_URL;

  beforeEach(async () => {
    process.env.FRONTEND_URL = 'http://localhost:3001';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MiddlewareService,
        {
          provide: AccessTokenService,
          useValue: {},
        },
        {
          provide: WorkspaceCacheStorageService,
          useValue: {},
        },
        {
          provide: WorkspaceManyOrAllFlatEntityMapsCacheService,
          useValue: {},
        },
        {
          provide: ExceptionHandlerService,
          useValue: {
            handleException: jest.fn(),
          },
        },
        {
          provide: JwtWrapperService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(AppTokenEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<MiddlewareService>(MiddlewareService);
  });

  afterEach(() => {
    process.env.FRONTEND_URL = originalFrontendUrl;
  });

  it('menyertakan Access-Control-Allow-Origin pada error GraphQL hydrate', () => {
    const writeHead = jest.fn();
    const write = jest.fn();
    const end = jest.fn();

    const res = {
      writeHead,
      write,
      end,
    } as unknown as Response;

    const req = {
      headers: {
        origin: 'http://localhost:3001',
      },
    } as unknown as Request;

    service.writeGraphqlResponseOnExceptionCaught(
      req,
      res,
      new AuthException('Unauthorized', AuthExceptionCode.FORBIDDEN_EXCEPTION),
    );

    expect(writeHead).toHaveBeenCalledWith(
      200,
      expect.objectContaining({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3001',
      }),
    );
  });
});
