import { isDefined } from 'shared/utils';

import { type WorkspacePreQueryHookInstance } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/interfaces/workspace-query-hook.interface';
import { type CreateManyResolverArgs } from 'src/engine/api/graphql/workspace-resolver-builder/interfaces/workspace-resolvers-builder.interface';
import { WorkspaceQueryHook } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/decorators/workspace-query-hook.decorator';
import { AddressGeocodeOnSaveService } from 'src/engine/core-modules/geo-map/services/address-geocode-on-save.service';
import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';

@WorkspaceQueryHook(`*.createMany`)
export class AddressGeocodeCreateManyPreQueryHook
  implements WorkspacePreQueryHookInstance
{
  constructor(
    private readonly addressGeocodeOnSaveService: AddressGeocodeOnSaveService,
  ) {}

  async execute(
    authContext: WorkspaceAuthContext,
    objectName: string,
    payload: CreateManyResolverArgs<Record<string, unknown>>,
  ): Promise<CreateManyResolverArgs<Record<string, unknown>>> {
    if (!isDefined(payload.data) || payload.data.length === 0) {
      return payload;
    }

    const enrichedData =
      await this.addressGeocodeOnSaveService.enrichRecordsWithGeocodedAddresses(
        {
          workspaceId: authContext.workspace.id,
          objectNameSingular: objectName,
          records: payload.data,
        },
      );

    return {
      ...payload,
      data: enrichedData,
    };
  }
}
