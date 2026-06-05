import { Injectable } from '@nestjs/common';

import {
  type ObjectsPermissions,
  type ObjectsPermissionsByRoleId,
} from 'shared/types';
import { camelToSnakeCase, isDefined } from 'shared/utils';

import { COMMON_PRELOAD_TOOLS } from 'src/engine/core-modules/tool-provider/constants/common-preload-tools.const';
import { type ToolProviderContext } from 'src/engine/core-modules/tool-provider/interfaces/tool-provider-context.type';
import {
  EXA_WEB_SEARCH_TOOL_NAME,
  ExaWebSearchTool,
} from 'src/engine/core-modules/tool/tools/exa-web-search-tool/exa-web-search-tool';
import { type BrowsingContextType } from 'src/engine/metadata-modules/ai/ai-agent/types/browsingContext.type';
import { isWorkflowRelatedObject } from 'src/engine/metadata-modules/ai/ai-agent/utils/is-workflow-related-object.util';
import { WorkspaceManyOrAllFlatEntityMapsCacheService } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.service';
import { computePermissionIntersection } from 'src/engine/sid-orm/utils/compute-permission-intersection.util';
import { WorkspaceCacheService } from 'src/engine/workspace-cache/services/workspace-cache.service';

const MAX_PRELOAD_READ_OBJECTS = 12;
const NAVIGATE_APP_TOOL_NAME = 'navigate_app';

type ReadableObjectCandidate = {
  nameSingular: string;
  namePlural: string;
  labelSingular: string;
  isSystem: boolean;
};

@Injectable()
export class AiChatPreloadToolsResolverService {
  constructor(
    private readonly workspaceCacheService: WorkspaceCacheService,
    private readonly flatEntityMapsCacheService: WorkspaceManyOrAllFlatEntityMapsCacheService,
    private readonly exaWebSearchTool: ExaWebSearchTool,
  ) {}

  async resolveToolNames({
    workspaceId,
    roleId,
    browsingContext,
  }: {
    workspaceId: string;
    roleId: string;
    browsingContext: BrowsingContextType | null;
  }): Promise<string[]> {
    const context: ToolProviderContext = {
      workspaceId,
      roleId,
      rolePermissionConfig: { intersectionOf: [roleId] },
    };

    const toolNames = new Set<string>([
      ...COMMON_PRELOAD_TOOLS,
      NAVIGATE_APP_TOOL_NAME,
    ]);

    if (this.exaWebSearchTool.isEnabled()) {
      toolNames.add(EXA_WEB_SEARCH_TOOL_NAME);
    }

    const readableObjects = await this.getReadableObjectCandidates(context);

    const prioritizedObjects = this.prioritizeObjects(
      readableObjects,
      browsingContext,
    );

    for (const object of prioritizedObjects.slice(
      0,
      MAX_PRELOAD_READ_OBJECTS,
    )) {
      const snakePlural = camelToSnakeCase(object.namePlural);
      const snakeSingular = camelToSnakeCase(object.nameSingular);

      toolNames.add(`find_${snakePlural}`);
      toolNames.add(`find_one_${snakeSingular}`);
      toolNames.add(`group_by_${snakePlural}`);
    }

    if (isDefined(browsingContext)) {
      const activeObject = readableObjects.find(
        (object) => object.nameSingular === browsingContext.objectNameSingular,
      );

      if (isDefined(activeObject)) {
        const snakePlural = camelToSnakeCase(activeObject.namePlural);
        const snakeSingular = camelToSnakeCase(activeObject.nameSingular);

        toolNames.add(`find_${snakePlural}`);
        toolNames.add(`find_one_${snakeSingular}`);
      }
    }

    return [...toolNames];
  }

  private async getReadableObjectCandidates(
    context: ToolProviderContext,
  ): Promise<ReadableObjectCandidate[]> {
    const { rolesPermissions } =
      await this.workspaceCacheService.getOrRecompute(context.workspaceId, [
        'rolesPermissions',
      ]);

    const objectPermissions = this.getObjectPermissions(
      rolesPermissions,
      context.rolePermissionConfig,
    );

    if (!objectPermissions) {
      return [];
    }

    const { flatObjectMetadataMaps } =
      await this.flatEntityMapsCacheService.getOrRecomputeManyOrAllFlatEntityMaps(
        {
          workspaceId: context.workspaceId,
          flatMapsKeys: ['flatObjectMetadataMaps'],
        },
      );

    return Object.values(flatObjectMetadataMaps.byUniversalIdentifier)
      .filter(isDefined)
      .filter((object) => object.isActive)
      .filter((object) => !isWorkflowRelatedObject(object))
      .filter((object) => objectPermissions[object.id]?.canReadObjectRecords)
      .map((object) => ({
        nameSingular: object.nameSingular,
        namePlural: object.namePlural,
        labelSingular: object.labelSingular,
        isSystem: object.isSystem,
      }))
      .sort((left, right) => {
        if (left.isSystem !== right.isSystem) {
          return left.isSystem ? 1 : -1;
        }

        return left.labelSingular.localeCompare(right.labelSingular, 'id');
      });
  }

  private prioritizeObjects(
    objects: ReadableObjectCandidate[],
    browsingContext: BrowsingContextType | null,
  ): ReadableObjectCandidate[] {
    if (!isDefined(browsingContext)) {
      return objects;
    }

    const activeObjectName = browsingContext.objectNameSingular;
    const active = objects.find(
      (object) => object.nameSingular === activeObjectName,
    );
    const rest = objects.filter(
      (object) => object.nameSingular !== activeObjectName,
    );

    return active ? [active, ...rest] : objects;
  }

  private getObjectPermissions(
    rolesPermissions: ObjectsPermissionsByRoleId,
    rolePermissionConfig: ToolProviderContext['rolePermissionConfig'],
  ): ObjectsPermissions | null {
    if ('intersectionOf' in rolePermissionConfig) {
      const allRolePermissions = rolePermissionConfig.intersectionOf.map(
        (roleId: string) => rolesPermissions[roleId],
      );

      return allRolePermissions.length === 1
        ? allRolePermissions[0]
        : computePermissionIntersection(allRolePermissions);
    }

    if ('unionOf' in rolePermissionConfig) {
      if (rolePermissionConfig.unionOf.length === 1) {
        return rolesPermissions[rolePermissionConfig.unionOf[0]];
      }

      return null;
    }

    return null;
  }
}
