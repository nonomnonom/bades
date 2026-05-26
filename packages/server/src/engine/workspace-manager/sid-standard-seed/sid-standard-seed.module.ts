import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FieldMetadataModule } from 'src/engine/metadata-modules/field-metadata/field-metadata.module';
import { ObjectMetadataModule } from 'src/engine/metadata-modules/object-metadata/object-metadata.module';
import { SidStandardSeedService } from 'src/engine/workspace-manager/sid-standard-seed/sid-standard-seed.service';

@Module({
  imports: [
    ObjectMetadataModule,
    FieldMetadataModule,
    // Akses DataSource untuk insert raw sample record ke workspace schema.
    TypeOrmModule.forFeature([]),
  ],
  providers: [SidStandardSeedService],
  exports: [SidStandardSeedService],
})
export class SidStandardSeedModule {}
