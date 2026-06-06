import {
  type DynamicModule,
  Global,
  Module,
  type Provider,
} from '@nestjs/common';

import { capitalize } from 'shared/utils';

import { metadataToRepositoryMapping } from 'src/engine/object-metadata-repository/metadata-to-repository.mapping';
import { GlobalWorkspaceOrmManager } from 'src/engine/sid-orm/global-workspace-datasource/global-workspace-orm.manager';
import { SidOrmModule } from 'src/engine/sid-orm/sid-orm.module';
import { WorkspaceDataSourceModule } from 'src/engine/workspace-datasource/workspace-datasource.module';
import { convertClassNameToObjectMetadataName } from 'src/engine/workspace-manager/utils/convert-class-to-object-metadata-name.util';

@Global()
@Module({})
export class ObjectMetadataRepositoryModule {
  static forFeature(objectMetadatas: { name: string }[]): DynamicModule {
    const providers: Provider[] = objectMetadatas.map(
      (objectMetadata: { name: string }) => {
        const repositoryClass = (
          metadataToRepositoryMapping as Record<
            string,
            new (manager: GlobalWorkspaceOrmManager) => object
          >
        )[objectMetadata.name];

        if (!repositoryClass) {
          throw new Error(
            `Repository tidak ditemukan untuk ${objectMetadata.name}`,
          );
        }

        return {
          provide: `${capitalize(
            convertClassNameToObjectMetadataName(objectMetadata.name),
          )}Repository`,
          useFactory: (
            globalWorkspaceOrmManager: GlobalWorkspaceOrmManager,
          ) => {
            return new repositoryClass(globalWorkspaceOrmManager);
          },
          inject: [GlobalWorkspaceOrmManager],
        };
      },
    );

    return {
      module: ObjectMetadataRepositoryModule,
      imports: [WorkspaceDataSourceModule, SidOrmModule],
      providers: [...providers],
      exports: providers,
    };
  }
}
