import { Global, Module } from '@nestjs/common';

import { CircuitBreakerService } from 'src/engine/core-modules/circuit-breaker/circuit-breaker.service';

@Global()
@Module({
  providers: [CircuitBreakerService],
  exports: [CircuitBreakerService],
})
export class CircuitBreakerModule {}
