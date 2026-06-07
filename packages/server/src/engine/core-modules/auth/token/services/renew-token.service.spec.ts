import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { IsNull, Repository } from 'typeorm';

import { AppTokenEntity } from 'src/engine/core-modules/app-token/app-token.entity';
import { AuthException } from 'src/engine/core-modules/auth/auth.exception';
import { AccessTokenService } from 'src/engine/core-modules/auth/token/services/access-token.service';
import { RefreshTokenService } from 'src/engine/core-modules/auth/token/services/refresh-token.service';
import { WorkspaceAgnosticTokenService } from 'src/engine/core-modules/auth/token/services/workspace-agnostic-token.service';
import { JwtTokenTypeEnum } from 'src/engine/core-modules/auth/types/auth-context.type';
import { type UserEntity } from 'src/engine/core-modules/user/user.entity';
import { AuthProviderEnum } from 'src/engine/core-modules/workspace/types/workspace.type';

import { RenewTokenService } from './renew-token.service';

describe('RenewTokenService', () => {
  let service: RenewTokenService;
  let appTokenRepository: Repository<AppTokenEntity>;
  let accessTokenService: AccessTokenService;
  let refreshTokenService: RefreshTokenService;
  let workspaceAgnosticTokenService: WorkspaceAgnosticTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RenewTokenService,
        {
          provide: getRepositoryToken(AppTokenEntity),
          useClass: Repository,
        },
        {
          provide: AccessTokenService,
          useValue: {
            generateAccessToken: jest.fn(),
          },
        },
        {
          provide: WorkspaceAgnosticTokenService,
          useValue: {
            generateWorkspaceAgnosticToken: jest.fn(),
          },
        },
        {
          provide: RefreshTokenService,
          useValue: {
            verifyRefreshToken: jest.fn(),
            generateRefreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RenewTokenService>(RenewTokenService);
    appTokenRepository = module.get<Repository<AppTokenEntity>>(
      getRepositoryToken(AppTokenEntity),
    );
    accessTokenService = module.get<AccessTokenService>(AccessTokenService);
    refreshTokenService = module.get<RefreshTokenService>(RefreshTokenService);
    workspaceAgnosticTokenService = module.get<WorkspaceAgnosticTokenService>(
      WorkspaceAgnosticTokenService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTokensFromRefreshToken', () => {
    it('should generate new access and refresh tokens', async () => {
      const mockRefreshToken = 'valid-refresh-token';
      const mockUser = { id: 'user-id' } as UserEntity;
      const mockWorkspaceId = 'workspace-id';
      const mockTokenId = 'token-id';
      const mockAccessToken = {
        token: 'new-access-token',
        expiresAt: new Date(),
      };
      const mockNewRefreshToken = {
        token: 'new-refresh-token',
        expiresAt: new Date(),
        targetedTokenType: JwtTokenTypeEnum.ACCESS,
      };
      const mockAppToken: Partial<AppTokenEntity> = {
        id: mockTokenId,
        workspaceId: mockWorkspaceId,
      } as AppTokenEntity;

      jest.spyOn(refreshTokenService, 'verifyRefreshToken').mockResolvedValue({
        user: mockUser,
        token: mockAppToken as AppTokenEntity,
        authProvider: AuthProviderEnum.Password,
        targetedTokenType: JwtTokenTypeEnum.ACCESS,
        isImpersonating: false,
        impersonatorUserWorkspaceId: undefined,
        impersonatedUserWorkspaceId: undefined,
      });
      jest.spyOn(appTokenRepository, 'update').mockResolvedValue({} as any);
      jest
        .spyOn(accessTokenService, 'generateAccessToken')
        .mockResolvedValue(mockAccessToken);
      jest
        .spyOn(refreshTokenService, 'generateRefreshToken')
        .mockResolvedValue(mockNewRefreshToken);

      const result =
        await service.generateTokensFromRefreshToken(mockRefreshToken);

      expect(result).toEqual({
        accessOrWorkspaceAgnosticToken: mockAccessToken,
        refreshToken: mockNewRefreshToken,
      });
      expect(refreshTokenService.verifyRefreshToken).toHaveBeenCalledWith(
        mockRefreshToken,
      );
      expect(appTokenRepository.update).toHaveBeenCalledWith(
        { id: mockTokenId, revokedAt: IsNull() },
        { revokedAt: expect.any(Date) },
      );
      expect(accessTokenService.generateAccessToken).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUser.id,
          workspaceId: mockWorkspaceId,
          authProvider: AuthProviderEnum.Password,
        }),
      );
      expect(refreshTokenService.generateRefreshToken).toHaveBeenCalledWith(
        expect.objectContaining({
          authProvider: AuthProviderEnum.Password,
          targetedTokenType: JwtTokenTypeEnum.ACCESS,
          userId: mockUser.id,
          workspaceId: mockWorkspaceId,
        }),
      );
    });

    it('should propagate impersonation claims when present', async () => {
      const mockRefreshToken = 'valid-refresh-token';
      const mockUser = { id: 'user-id' } as UserEntity;
      const mockWorkspaceId = 'workspace-id';
      const mockTokenId = 'token-id';
      const mockAccessToken = {
        token: 'new-access-token',
        expiresAt: new Date(),
      };
      const mockNewRefreshToken = {
        token: 'new-refresh-token',
        expiresAt: new Date(),
        targetedTokenType: JwtTokenTypeEnum.ACCESS,
      };
      const mockAppToken = {
        id: mockTokenId,
        workspaceId: mockWorkspaceId,
      } as AppTokenEntity;

      jest.spyOn(refreshTokenService, 'verifyRefreshToken').mockResolvedValue({
        user: mockUser,
        token: mockAppToken as AppTokenEntity,
        authProvider: AuthProviderEnum.Password,
        targetedTokenType: JwtTokenTypeEnum.ACCESS,
        isImpersonating: true,
        impersonatorUserWorkspaceId: 'uw-imp',
        impersonatedUserWorkspaceId: 'uw-orig',
      });
      jest.spyOn(appTokenRepository, 'update').mockResolvedValue({} as any);
      const accessSpy = jest
        .spyOn(accessTokenService, 'generateAccessToken')
        .mockResolvedValue(mockAccessToken);
      const refreshSpy = jest
        .spyOn(refreshTokenService, 'generateRefreshToken')
        .mockResolvedValue(mockNewRefreshToken);

      await service.generateTokensFromRefreshToken(mockRefreshToken);

      expect(accessSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          isImpersonating: true,
          impersonatorUserWorkspaceId: 'uw-imp',
          impersonatedUserWorkspaceId: 'uw-orig',
        }),
      );
      expect(refreshSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          isImpersonating: true,
          impersonatorUserWorkspaceId: 'uw-imp',
          impersonatedUserWorkspaceId: 'uw-orig',
        }),
      );
    });

    it('should throw an error if refresh token is not provided', async () => {
      await expect(service.generateTokensFromRefreshToken('')).rejects.toThrow(
        AuthException,
      );
    });

    it('should generate workspace-agnostic token when targeted type is WORKSPACE_AGNOSTIC', async () => {
      const mockUser = { id: 'user-id' } as UserEntity;
      const mockTokenId = 'token-id';
      const mockAppToken = {
        id: mockTokenId,
      } as AppTokenEntity;
      const mockWorkspaceAgnosticToken = {
        token: 'new-workspace-agnostic-token',
        expiresAt: new Date(),
      };
      const mockNewRefreshToken = {
        token: 'new-refresh-token',
        expiresAt: new Date(),
      };
      const workspaceAgnosticTokenServiceSpy = jest
        .spyOn(workspaceAgnosticTokenService, 'generateWorkspaceAgnosticToken')
        .mockResolvedValue(mockWorkspaceAgnosticToken);
      jest.spyOn(refreshTokenService, 'verifyRefreshToken').mockResolvedValue({
        user: mockUser,
        token: mockAppToken,
        authProvider: AuthProviderEnum.Password,
        targetedTokenType: JwtTokenTypeEnum.WORKSPACE_AGNOSTIC,
        isImpersonating: false,
        impersonatorUserWorkspaceId: undefined,
        impersonatedUserWorkspaceId: undefined,
      });
      jest.spyOn(appTokenRepository, 'update').mockResolvedValue({} as any);
      jest
        .spyOn(refreshTokenService, 'generateRefreshToken')
        .mockResolvedValue(mockNewRefreshToken);

      const result = await service.generateTokensFromRefreshToken(
        'valid-refresh-token',
      );

      expect(result.accessOrWorkspaceAgnosticToken).toEqual(
        mockWorkspaceAgnosticToken,
      );
      expect(workspaceAgnosticTokenServiceSpy).toHaveBeenCalledWith({
        userId: mockUser.id,
        authProvider: AuthProviderEnum.Password,
      });
    });

    it('should throw when legacy ACCESS refresh token has no workspaceId', async () => {
      const mockUser = { id: 'user-id' } as UserEntity;
      const mockAppToken = {
        id: 'token-id',
      } as AppTokenEntity;

      jest.spyOn(refreshTokenService, 'verifyRefreshToken').mockResolvedValue({
        user: mockUser,
        token: mockAppToken,
        authProvider: AuthProviderEnum.Password,
        targetedTokenType: undefined,
        isImpersonating: false,
        impersonatorUserWorkspaceId: undefined,
        impersonatedUserWorkspaceId: undefined,
      } as unknown as Awaited<
        ReturnType<RefreshTokenService['verifyRefreshToken']>
      >);
      jest.spyOn(appTokenRepository, 'update').mockResolvedValue({} as any);

      await expect(
        service.generateTokensFromRefreshToken('legacy-refresh-token'),
      ).rejects.toThrow(AuthException);
    });
  });
});
