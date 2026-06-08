import { Injectable } from '@nestjs/common';

import { isNonEmptyString } from '@sniptt/guards';
import { type Request, type Response } from 'express';
import { type APP_LOCALES, SOURCE_LOCALE } from 'shared/translations';
import { isDefined } from 'shared/utils';

import { AuthException } from 'src/engine/core-modules/auth/auth.exception';
import { AuthGraphqlApiExceptionFilter } from 'src/engine/core-modules/auth/filters/auth-graphql-api-exception.filter';
import { AccessTokenService } from 'src/engine/core-modules/auth/token/services/access-token.service';
import { getAuthExceptionRestStatus } from 'src/engine/core-modules/auth/utils/get-auth-exception-rest-status.util';
import { ExceptionHandlerService } from 'src/engine/core-modules/exception-handler/exception-handler.service';
import { ErrorCode } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import { JwtWrapperService } from 'src/engine/core-modules/jwt/services/jwt-wrapper.service';
import { WorkspaceManyOrAllFlatEntityMapsCacheService } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service';
import { INTERNAL_SERVER_ERROR } from 'src/engine/middlewares/constants/default-error-message.constant';
import { bindDataToRequestObject } from 'src/engine/utils/bind-data-to-request-object.util';
import {
  handleException,
  handleExceptionAndConvertToGraphQLError,
} from 'src/engine/utils/global-exception-handler.util';
import { WorkspaceCacheStorageService } from 'src/engine/workspace-cache-storage/workspace-cache-storage.service';
import { getAllowedCorsOriginHeader } from 'src/utils/cors-origin.util';
import { type CustomException } from 'src/utils/custom-exception';

@Injectable()
export class MiddlewareService {
  constructor(
    private readonly accessTokenService: AccessTokenService,
    private readonly workspaceStorageCacheService: WorkspaceCacheStorageService,
    private readonly flatEntityMapsCacheService: WorkspaceManyOrAllFlatEntityMapsCacheService,
    private readonly exceptionHandlerService: ExceptionHandlerService,
    private readonly jwtWrapperService: JwtWrapperService,
  ) {}

  public isTokenPresent(request: Request): boolean {
    const token = this.jwtWrapperService.extractJwtFromRequest()(request);

    return !!token;
  }

  public writeRestResponseOnExceptionCaught(
    req: Request,
    res: Response,
    error: unknown,
  ) {
    const statusCode = this.getStatus(error);
    const errorMessage =
      error instanceof Error ? error.message : INTERNAL_SERVER_ERROR;
    const errorCode =
      error && typeof error === 'object' && 'code' in error
        ? (error as Record<string, unknown>).code
        : ErrorCode.INTERNAL_SERVER_ERROR;

    // capture and handle custom exceptions
    if (error instanceof Error) {
      handleException({
        exception: error as CustomException,
        exceptionHandlerService: this.exceptionHandlerService,
        statusCode,
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const allowedOrigin = getAllowedCorsOriginHeader(
      req.headers.origin as string | undefined,
    );

    if (allowedOrigin) {
      headers['Access-Control-Allow-Origin'] = allowedOrigin;
    }

    res.writeHead(statusCode, headers);
    res.write(
      JSON.stringify({
        statusCode,
        messages: [errorMessage],
        error: errorCode,
      }),
    );

    res.end();
  }

  public writeGraphqlResponseOnExceptionCaught(
    req: Request,
    res: Response,
    error: unknown,
  ) {
    let errors;

    if (error instanceof AuthException) {
      try {
        const authFilter = new AuthGraphqlApiExceptionFilter();

        authFilter.catch(error);
      } catch (transformedError) {
        errors = [transformedError];
      }
    } else {
      errors = [
        handleExceptionAndConvertToGraphQLError(
          error as Error,
          this.exceptionHandlerService,
        ),
      ];
    }

    const statusCode = 200;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const allowedOrigin = getAllowedCorsOriginHeader(
      req.headers.origin as string | undefined,
    );

    if (allowedOrigin) {
      headers['Access-Control-Allow-Origin'] = allowedOrigin;
    }

    res.writeHead(statusCode, headers);

    res.write(
      JSON.stringify({
        errors,
      }),
    );

    res.end();
  }

  public async hydrateRestRequest(request: Request) {
    const data = await this.accessTokenService.validateTokenByRequest(request);
    const metadataVersion = data.workspace
      ? await this.workspaceStorageCacheService.getMetadataVersion(
          data.workspace.id,
        )
      : undefined;

    if (!data.workspace) {
      throw new Error('Tidak ada sumber data ditemukan');
    }

    if (!isNonEmptyString(data.workspace.databaseSchema)) {
      throw new Error('Tidak ada sumber data ditemukan');
    }

    bindDataToRequestObject(data, request, metadataVersion);
  }

  public async hydrateGraphqlRequest(request: Request) {
    if (!this.isTokenPresent(request)) {
      request.locale =
        (request.headers['x-locale'] as keyof typeof APP_LOCALES) ??
        SOURCE_LOCALE;

      return;
    }

    const data = await this.accessTokenService.validateTokenByRequest(request);
    const metadataVersion = data.workspace
      ? await this.workspaceStorageCacheService.getMetadataVersion(
          data.workspace.id,
        )
      : undefined;

    bindDataToRequestObject(data, request, metadataVersion);
  }

  private hasErrorStatus(error: unknown): error is { status: number } {
    return isDefined((error as { status: number })?.status);
  }

  private getStatus(error: unknown): number {
    if (this.hasErrorStatus(error)) {
      return error.status;
    }

    if (error instanceof AuthException) {
      return getAuthExceptionRestStatus(error);
    }

    return 500;
  }
}
