import { type DynamicModule, Global } from '@nestjs/common';

import { CodeInterpreterDriverFactory } from 'src/engine/core-modules/code-interpreter/code-interpreter-driver.factory';
import { CodeInterpreterService } from 'src/engine/core-modules/code-interpreter/code-interpreter.service';
import { BadesConfigModule } from 'src/engine/core-modules/bades-config/bades-config.module';

@Global()
export class CodeInterpreterModule {
  static forRoot(): DynamicModule {
    return {
      module: CodeInterpreterModule,
      imports: [BadesConfigModule],
      providers: [CodeInterpreterDriverFactory, CodeInterpreterService],
      exports: [CodeInterpreterService],
    };
  }
}
