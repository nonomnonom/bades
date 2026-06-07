import { type CanActivate } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ApiKeyService } from 'src/engine/core-modules/api-key/services/api-key.service';
import { AppTokenEntity } from 'src/engine/core-modules/app-token/app-token.entity';
import { AuditService } from 'src/engine/core-modules/audit/services/audit.service';
import { SignInUpService } from 'src/engine/core-modules/auth/services/sign-in-up.service';
import { RefreshTokenService } from 'src/engine/core-modules/auth/token/services/refresh-token.service';
import { WorkspaceAgnosticTokenService } from 'src/engine/core-modules/auth/token/services/workspace-agnostic-token.service';
import { CaptchaGuard } from 'src/engine/core-modules/captcha/captcha.guard';
import { WorkspaceDomainsService } from 'src/engine/core-modules/domain/workspace-domains/services/workspace-domains.service';
import { EmailVerificationService } from 'src/engine/core-modules/email-verification/services/email-verification.service';
import { FeatureFlagService } from 'src/engine/core-modules/feature-flag/services/feature-flag.service';
import { SSOService } from 'src/engine/core-modules/sso/services/sso.service';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';
import { TwoFactorAuthenticationService } from 'src/engine/core-modules/two-factor-authentication/two-factor-authentication.service';
import { UserWorkspaceEntity } from 'src/engine/core-modules/user-workspace/user-workspace.entity';
import { UserWorkspaceService } from 'src/engine/core-modules/user-workspace/user-workspace.service';
import { UserService } from 'src/engine/core-modules/user/services/user.service';
import { UserEntity } from 'src/engine/core-modules/user/user.entity';
import { PermissionsService } from 'src/engine/metadata-modules/permissions/permissions.service';

import { EmailVerificationTrigger } from 'src/engine/core-modules/email-verification/email-verification.constants';
import { SOURCE_LOCALE } from 'shared/translations';

import { AuthResolver } from './auth.resolver';

import { AuthService } from './services/auth.service';
import { ResetPasswordService } from './services/reset-password.service';
import { EmailVerificationTokenService } from './token/services/email-verification-token.service';
import { LoginTokenService } from './token/services/login-token.service';
import { RenewTokenService } from './token/services/renew-token.service';
import { TransientTokenService } from './token/services/transient-token.service';

describe('AuthResolver', () => {
  let resolver: AuthResolver;
  let badesConfigService: { get: jest.Mock };
  let signInUpService: { signUpWithoutWorkspace: jest.Mock };
  let userWorkspaceService: {
    findAvailableWorkspacesByEmail: jest.Mock;
    setLoginTokenToAvailableWorkspacesWhenAuthProviderMatch: jest.Mock;
  };
  let emailVerificationService: { sendVerificationEmail: jest.Mock };
  let workspaceAgnosticTokenService: {
    generateWorkspaceAgnosticToken: jest.Mock;
  };
  let refreshTokenService: { generateRefreshToken: jest.Mock };
  const mock_CaptchaGuard: CanActivate = { canActivate: jest.fn(() => true) };

  beforeEach(async () => {
    badesConfigService = { get: jest.fn() };
    signInUpService = { signUpWithoutWorkspace: jest.fn() };
    userWorkspaceService = {
      findAvailableWorkspacesByEmail: jest.fn(),
      setLoginTokenToAvailableWorkspacesWhenAuthProviderMatch: jest.fn(),
    };
    emailVerificationService = { sendVerificationEmail: jest.fn() };
    workspaceAgnosticTokenService = {
      generateWorkspaceAgnosticToken: jest.fn(),
    };
    refreshTokenService = { generateRefreshToken: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: getRepositoryToken(AppTokenEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {},
        },
        {
          provide: getRepositoryToken(UserWorkspaceEntity),
          useValue: {},
        },
        {
          provide: AuthService,
          useValue: {},
        },
        {
          provide: RefreshTokenService,
          useValue: refreshTokenService,
        },
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: WorkspaceDomainsService,
          useValue: {
            buildWorkspaceURL: jest
              .fn()
              .mockResolvedValue(new URL('http://localhost:3001')),
          },
        },
        {
          provide: UserWorkspaceService,
          useValue: userWorkspaceService,
        },
        {
          provide: RenewTokenService,
          useValue: {},
        },
        {
          provide: SignInUpService,
          useValue: signInUpService,
        },
        {
          provide: ApiKeyService,
          useValue: {},
        },
        {
          provide: ResetPasswordService,
          useValue: {},
        },
        {
          provide: LoginTokenService,
          useValue: {},
        },
        {
          provide: WorkspaceAgnosticTokenService,
          useValue: workspaceAgnosticTokenService,
        },
        {
          provide: TransientTokenService,
          useValue: {},
        },
        {
          provide: EmailVerificationService,
          useValue: emailVerificationService,
        },
        {
          provide: EmailVerificationTokenService,
          useValue: {},
        },
        {
          provide: PermissionsService,
          useValue: {},
        },
        {
          provide: FeatureFlagService,
          useValue: {},
        },
        {
          provide: SSOService,
          useValue: {},
        },
        {
          provide: TwoFactorAuthenticationService,
          useValue: {},
        },
        {
          provide: BadesConfigService,
          useValue: badesConfigService,
        },
        {
          provide: AuditService,
          useValue: {
            createContext: jest.fn().mockReturnValue({
              insertWorkspaceEvent: jest.fn(),
            }),
          },
        },
      ],
    })
      .overrideGuard(CaptchaGuard)
      .useValue(mock_CaptchaGuard)
      .compile();

    resolver = module.get<AuthResolver>(AuthResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('signUp', () => {
    it('mengembalikan tokens null saat verifikasi email wajib', async () => {
      const user = {
        id: 'user-id',
        email: 'budi@bades.id',
      };

      signInUpService.signUpWithoutWorkspace.mockResolvedValue(user);
      userWorkspaceService.findAvailableWorkspacesByEmail.mockResolvedValue([]);
      userWorkspaceService.setLoginTokenToAvailableWorkspacesWhenAuthProviderMatch.mockResolvedValue(
        [],
      );
      badesConfigService.get.mockReturnValue(true);

      const result = await resolver.signUp({
        email: user.email,
        password: 'password123',
        locale: SOURCE_LOCALE,
      });

      expect(
        emailVerificationService.sendVerificationEmail,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: user.id,
          verificationTrigger: EmailVerificationTrigger.SIGN_UP,
        }),
      );
      expect(result.tokens).toBeNull();
      expect(
        workspaceAgnosticTokenService.generateWorkspaceAgnosticToken,
      ).not.toHaveBeenCalled();
      expect(refreshTokenService.generateRefreshToken).not.toHaveBeenCalled();
    });
  });
});
