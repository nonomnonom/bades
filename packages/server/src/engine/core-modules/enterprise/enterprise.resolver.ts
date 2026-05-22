/* @license Enterprise */

import { UseFilters, UseGuards, UsePipes } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { EnterpriseExceptionFilter } from 'src/engine/core-modules/enterprise/enterprise-exception.filter';
import { EnterpriseLicenseInfoDTO } from 'src/engine/core-modules/enterprise/dtos/enterprise-license-info.dto';
import {
  EnterpriseException,
  EnterpriseExceptionCode,
} from 'src/engine/core-modules/enterprise/enterprise.exception';
import { EnterprisePlanService } from 'src/engine/core-modules/enterprise/services/enterprise-plan.service';
import { PreventNestToAutoLogGraphqlErrorsFilter } from 'src/engine/core-modules/graphql/filters/prevent-nest-to-auto-log-graphql-errors.filter';
import { ResolverValidationPipe } from 'src/engine/core-modules/graphql/pipes/resolver-validation.pipe';
import { ConfigVariableExceptionCode } from 'src/engine/core-modules/twenty-config/twenty-config.exception';
import { AdminPanelGuard } from 'src/engine/guards/admin-panel-guard';
import { BillingDisabledGuard } from 'src/engine/guards/billing-disabled.guard';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';

@Resolver()
@UsePipes(ResolverValidationPipe)
@UseFilters(EnterpriseExceptionFilter, PreventNestToAutoLogGraphqlErrorsFilter)
export class EnterpriseResolver {
  constructor(
    private readonly enterprisePlanService: EnterprisePlanService,
  ) {}

  @Mutation(() => EnterpriseLicenseInfoDTO)
  @UseGuards(
    WorkspaceAuthGuard,
    BillingDisabledGuard,
    AdminPanelGuard,
    NoPermissionGuard,
  )
  async setEnterpriseKey(
    @Args('enterpriseKey') enterpriseKey: string,
  ): Promise<EnterpriseLicenseInfoDTO> {
    try {
      if (
        !this.enterprisePlanService.isValidEnterpriseKeyFormat(enterpriseKey)
      ) {
        throw new EnterpriseException(
          'Invalid enterprise key',
          EnterpriseExceptionCode.INVALID_ENTERPRISE_KEY,
        );
      }

      await this.enterprisePlanService.setEnterpriseKey(enterpriseKey);

      return await this.enterprisePlanService.getLicenseInfo();
    } catch (error) {
      if (error instanceof EnterpriseException) {
        throw error;
      }

      if (
        error instanceof Error &&
        'code' in error &&
        error.code === ConfigVariableExceptionCode.DATABASE_CONFIG_DISABLED
      ) {
        throw new EnterpriseException(
          'IS_CONFIG_VARIABLES_IN_DB_ENABLED is false on the server. Please add ENTERPRISE_KEY to your .env file manually.',
          EnterpriseExceptionCode.CONFIG_VARIABLES_IN_DB_DISABLED,
        );
      }

      return {
        isValid: false,
        licensee: null,
        expiresAt: null,
        subscriptionId: null,
      };
    }
  }
}
