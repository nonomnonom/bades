import { type DynamicModule, Global, Module } from '@nestjs/common';

import { ConfigVariables } from 'src/engine/core-modules/bades-config/config-variables';
import { CONFIG_VARIABLES_INSTANCE_TOKEN } from 'src/engine/core-modules/bades-config/constants/config-variables-instance-tokens.constants';
import { DatabaseConfigModule } from 'src/engine/core-modules/bades-config/drivers/database-config.module';
import { ConfigGroupHashService } from 'src/engine/core-modules/bades-config/services/config-group-hash.service';
import { ConfigurableModuleClass } from 'src/engine/core-modules/bades-config/bades-config.module-definition';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';

@Global()
@Module({})
export class BadesConfigModule extends ConfigurableModuleClass {
  static forRoot(): DynamicModule {
    const isConfigVariablesInDbEnabled =
      process.env.IS_CONFIG_VARIABLES_IN_DB_ENABLED !== 'false';

    const imports = isConfigVariablesInDbEnabled
      ? [DatabaseConfigModule.forRoot()]
      : [];

    return {
      module: BadesConfigModule,
      imports,
      providers: [
        BadesConfigService,
        ConfigGroupHashService,
        {
          provide: CONFIG_VARIABLES_INSTANCE_TOKEN,
          useValue: new ConfigVariables(),
        },
      ],
      exports: [BadesConfigService, ConfigGroupHashService],
    };
  }
}
