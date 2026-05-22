import { type DynamicModule, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationEntity } from 'src/engine/core-modules/application/application.entity';
import { FileStorageDriverFactory } from 'src/engine/core-modules/file-storage/file-storage-driver.factory';
import { FileStorageService } from 'src/engine/core-modules/file-storage/file-storage.service';
import { FileEntity } from 'src/engine/core-modules/file/entities/file.entity';
import { BadesConfigModule } from 'src/engine/core-modules/bades-config/bades-config.module';

@Global()
export class FileStorageModule {
  static forRoot(): DynamicModule {
    return {
      module: FileStorageModule,
      imports: [
        BadesConfigModule,
        TypeOrmModule.forFeature([FileEntity, ApplicationEntity]),
      ],
      providers: [FileStorageDriverFactory, FileStorageService],
      exports: [FileStorageDriverFactory, FileStorageService],
    };
  }
}
