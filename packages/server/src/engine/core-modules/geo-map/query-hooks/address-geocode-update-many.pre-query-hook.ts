import { isDefined } from 'shared/utils';

import { type WorkspacePreQueryHookInstance } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/interfaces/workspace-query-hook.interface';
import { type UpdateManyResolverArgs } from 'src/engine/api/graphql/workspace-resolver-builder/interfaces/workspace-resolvers-builder.interface';
import { WorkspaceQueryHook } from 'src/engine/api/graphql/workspace-query-runner/workspace-query-hook/decorators/workspace-query-hook.decorator';
import { AddressGeocodeOnSaveService } from 'src/engine/core-modules/geo-map/services/address-geocode-on-save.service';
import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';

type RecordInput = Record<string, unknown>;

@WorkspaceQueryHook(`*.updateMany`)
export class AddressGeocodeUpdateManyPreQueryHook
  implements WorkspacePreQueryHookInstance
{
  constructor(
    private readonly addressGeocodeOnSaveService: AddressGeocodeOnSaveService,
  ) {}

  async execute(
    authContext: WorkspaceAuthContext,
    objectName: string,
    payload: UpdateManyResolverArgs<RecordInput>,
  ): Promise<UpdateManyResolverArgs<RecordInput>> {
    if (!isDefined(payload.data)) {
      return payload;
    }

    const enrichedData =
      await this.addressGeocodeOnSaveService.enrichRecordWithGeocodedAddresses({
        workspaceId: authContext.workspace.id,
        objectNameSingular: objectName,
        record: payload.data,
      });

    return {
      ...payload,
      data: enrichedData,
    };
  }
}
