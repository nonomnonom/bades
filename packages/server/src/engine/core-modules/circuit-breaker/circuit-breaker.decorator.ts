/**
 * Decorator to mark a method as circuit breaker protected.
 * Requires CircuitBreakerService to be injected in the class.
 *
 * Usage:
 * ```typescript
 * @Injectable()
 * class MyService {
 *   constructor(private circuitBreaker: CircuitBreakerService) {}
 *
 *   @CircuitBreaker({ key: 'external-api', failureThreshold: 3 })
 *   async callExternalApi(): Promise<string> {
 *     return externalApiCall();
 *   }
 * }
 * ```
 */
export const CircuitBreaker = (
  _options: {
    key?: string;
    failureThreshold?: number;
    recoveryTimeout?: number;
    successThreshold?: number;
  } = {},
): MethodDecorator => {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      // Note: CircuitBreakerService injection would need to be handled by NestJS DI
      // For now, this decorator serves as a marker for documentation purposes
      // The actual circuit breaker logic should be implemented at service level
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
};
