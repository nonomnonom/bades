import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationPackageFetcherService } from 'src/engine/core-modules/application/application-package/application-package-fetcher.service';
import { ApplicationVersionValidationService } from 'src/engine/core-modules/application/application-package/application-version-validation.service';
import { ApplicationEntity } from 'src/engine/core-modules/application/application.entity';
import { FileStorageModule } from 'src/engine/core-modules/file-storage/file-storage.module';
import { FileEntity } from 'src/engine/core-modules/file/entities/file.entity';
import { BadesConfigModule } from 'src/engine/core-modules/bades-config/bades-config.module';
import { UpgradeModule } from 'src/engine/core-modules/upgrade/upgrade.module';

@Module({
  imports: [
    FileStorageModule,
    BadesConfigModule,
    UpgradeModule,
    TypeOrmModule.forFeature([FileEntity, ApplicationEntity]),
  ],
  providers: [
    ApplicationPackageFetcherService,
    ApplicationVersionValidationService,
  ],
  exports: [
    ApplicationPackageFetcherService,
    ApplicationVersionValidationService,
  ],
})
export class ApplicationPackageModule {}
