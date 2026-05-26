import { Module } from '@nestjs/common';

import { FieldMetadataModule } from 'src/engine/metadata-modules/field-metadata/field-metadata.module';
import { ObjectMetadataModule } from 'src/engine/metadata-modules/object-metadata/object-metadata.module';
import { SidStandardSeedService } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed.service';

@Module({
  imports: [ObjectMetadataModule, FieldMetadataModule],
  providers: [SidStandardSeedService],
  exports: [SidStandardSeedService],
})
export class SidStandardSeedModule {}
