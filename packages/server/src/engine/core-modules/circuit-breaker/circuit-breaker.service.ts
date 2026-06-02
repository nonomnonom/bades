import { Logger } from '@nestjs/common';

export enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerOptions {
  /** Number of failures before opening the circuit */
  failureThreshold: number;
  /** Time in ms before attempting recovery (OPEN -> HALF_OPEN) */
  recoveryTimeout: number;
  /** Time in ms for monitoring window */
  monitoringWindow: number;
  /** Percentage of successful calls needed in HALF_OPEN to close circuit */
  successThreshold: number;
}

const DEFAULT_OPTIONS: CircuitBreakerOptions = {
  failureThreshold: 5,
  recoveryTimeout: 30000, // 30 seconds
  monitoringWindow: 60000, // 1 minute
  successThreshold: 0.5, // 50% success rate needed
};

type CircuitBreakerState = {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailureTime: number;
  nextAttemptTime: number;
};

export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private readonly circuits = new Map<string, CircuitBreakerState>();
  private readonly options: Map<string, CircuitBreakerOptions>;

  constructor(
    private readonly defaultOptions: Partial<CircuitBreakerOptions> = {},
  ) {
    this.options = new Map();
  }

  /**
   * Get or create circuit breaker for a given key
   */
  getCircuitBreaker(key: string): CircuitBreakerOptions {
    if (!this.options.has(key)) {
      this.options.set(key, {
        ...DEFAULT_OPTIONS,
        ...this.defaultOptions,
      });
      this.circuits.set(key, {
        state: CircuitState.CLOSED,
        failures: 0,
        successes: 0,
        lastFailureTime: 0,
        nextAttemptTime: 0,
      });
    }
    return this.options.get(key)!;
  }

  /**
   * Check if the circuit allows requests
   */
  isAllowed(key: string): boolean {
    const circuit = this.circuits.get(key);

    if (!circuit) {
      return true;
    }

    const options = this.getCircuitBreaker(key);

    switch (circuit.state) {
      case CircuitState.CLOSED:
        return true;

      case CircuitState.OPEN:
        const now = Date.now();
        if (now >= circuit.nextAttemptTime) {
          circuit.state = CircuitState.HALF_OPEN;
          circuit.successes = 0;
          circuit.failures = 0;
          this.logger.log(`Circuit ${key} transitioning to HALF_OPEN`);
          return true;
        }
        return false;

      case CircuitState.HALF_OPEN:
        return true;

      default:
        return true;
    }
  }

  /**
   * Record a successful call
   */
  recordSuccess(key: string): void {
    const circuit = this.circuits.get(key);
    const options = this.getCircuitBreaker(key);

    if (!circuit) {
      return;
    }

    switch (circuit.state) {
      case CircuitState.CLOSED:
        // Reset failures on success
        circuit.failures = 0;
        break;

      case CircuitState.HALF_OPEN:
        circuit.successes++;
        const successRate = circuit.successes / (circuit.successes + circuit.failures);
        if (successRate >= options.successThreshold) {
          circuit.state = CircuitState.CLOSED;
          circuit.failures = 0;
          circuit.successes = 0;
          this.logger.log(`Circuit ${key} CLOSED after ${circuit.successes} successes`);
        }
        break;

      case CircuitState.OPEN:
        break;
    }
  }

  /**
   * Record a failed call
   */
  recordFailure(key: string): void {
    const circuit = this.circuits.get(key);
    const options = this.getCircuitBreaker(key);

    if (!circuit) {
      return;
    }

    circuit.lastFailureTime = Date.now();

    switch (circuit.state) {
      case CircuitState.CLOSED:
        circuit.failures++;
        if (circuit.failures >= options.failureThreshold) {
          circuit.state = CircuitState.OPEN;
          circuit.nextAttemptTime =
            Date.now() + options.recoveryTimeout;
          this.logger.warn(
            `Circuit ${key} OPENED after ${circuit.failures} failures`,
          );
        }
        break;

      case CircuitState.HALF_OPEN:
        circuit.failures++;
        circuit.state = CircuitState.OPEN;
        circuit.nextAttemptTime = Date.now() + options.recoveryTimeout;
        this.logger.warn(`Circuit ${key} OPENED from HALF_OPEN after failure`);
        break;

      case CircuitState.OPEN:
        // Update next attempt time
        circuit.nextAttemptTime = Date.now() + options.recoveryTimeout;
        break;
    }
  }

  /**
   * Get current state of a circuit
   */
  getState(key: string): CircuitState | undefined {
    return this.circuits.get(key)?.state;
  }

  /**
   * Reset a circuit to CLOSED state
   */
  reset(key: string): void {
    const circuit = this.circuits.get(key);
    if (circuit) {
      circuit.state = CircuitState.CLOSED;
      circuit.failures = 0;
      circuit.successes = 0;
      circuit.lastFailureTime = 0;
      circuit.nextAttemptTime = 0;
      this.logger.log(`Circuit ${key} reset to CLOSED`);
    }
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(
    key: string,
    fn: () => Promise<T>,
    fallback?: () => Promise<T>,
  ): Promise<T> {
    if (!this.isAllowed(key)) {
      if (fallback) {
        this.logger.debug(`Circuit ${key} OPEN, executing fallback`);
        return fallback();
      }
      throw new Error(`Circuit ${key} is OPEN`);
    }

    try {
      const result = await fn();
      this.recordSuccess(key);
      return result;
    } catch (error) {
      this.recordFailure(key);
      if (fallback) {
        return fallback();
      }
      throw error;
    }
  }
}
