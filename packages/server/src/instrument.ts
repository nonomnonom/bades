import process from 'process';

import { metrics as otelMetrics, trace as otelTrace } from '@opentelemetry/api';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import {
  AggregationTemporality,
  ConsoleMetricExporter,
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

import { NodeEnvironment } from 'src/engine/core-modules/bades-config/interfaces/node-environment.interface';

import { ExceptionHandlerDriver } from 'src/engine/core-modules/exception-handler/interfaces';
import { MeterDriver } from 'src/engine/core-modules/metrics/types/meter-driver.type';
import { parseArrayEnvVar } from 'src/utils/parse-array-env-var';

const meterDrivers = parseArrayEnvVar(
  process.env.METER_DRIVER,
  Object.values(MeterDriver),
  [],
);

if (process.env.EXCEPTION_HANDLER_DRIVER === ExceptionHandlerDriver.SENTRY) {
  Sentry.init({
    environment: process.env.SENTRY_ENVIRONMENT,
    release: process.env.APP_VERSION,
    dsn: process.env.SENTRY_DSN,
    integrations: [
      Sentry.redisIntegration(),
      Sentry.httpIntegration(),
      Sentry.expressIntegration(),
      Sentry.graphqlIntegration(),
      Sentry.postgresIntegration(),
      Sentry.vercelAIIntegration({
        recordInputs: true,
        recordOutputs: true,
      }),
      nodeProfilingIntegration(),
    ],
    tracesSampleRate: 0.1,
    profilesSampleRate: 0.3,
    sendDefaultPii: true,
    debug: process.env.NODE_ENV === NodeEnvironment.DEVELOPMENT,
    beforeSendSpan: (span) => {
      const badesContext = Sentry.getIsolationScope().getScopeData().contexts
        ?.bades as
        | {
            workspace_id?: string;
            user_workspace_id?: string;
          }
        | undefined;

      if (!badesContext?.workspace_id) {
        return span;
      }

      span.data = {
        ...span.data,
        'bades.workspace.id': badesContext.workspace_id,
        ...(badesContext.user_workspace_id && {
          'bades.user_workspace.id': badesContext.user_workspace_id,
        }),
      };

      return span;
    },
  });
}

// Meter setup

const prometheusExporter = meterDrivers.includes(MeterDriver.Prometheus)
  ? new PrometheusExporter({ port: 9464 })
  : null;

const meterProvider = new MeterProvider({
  readers: [
    ...(meterDrivers.includes(MeterDriver.Console)
      ? [
          new PeriodicExportingMetricReader({
            exporter: new ConsoleMetricExporter(),
            exportIntervalMillis: 10000,
          }),
        ]
      : []),
    ...(meterDrivers.includes(MeterDriver.OpenTelemetry)
      ? [
          new PeriodicExportingMetricReader({
            exporter: new OTLPMetricExporter({
              url: process.env.OTLP_COLLECTOR_METRICS_ENDPOINT_URL,
              temporalityPreference: AggregationTemporality.DELTA,
            }),
            exportIntervalMillis: 10000,
          }),
        ]
      : []),
    ...(prometheusExporter ? [prometheusExporter] : []),
  ],
});

otelMetrics.setGlobalMeterProvider(meterProvider);

// Tracing setup
const otlpTraceEndpoint = process.env.OTLP_COLLECTOR_TRACES_ENDPOINT_URL;

if (otlpTraceEndpoint) {
  const traceExporter = new OTLPTraceExporter({
    url: otlpTraceEndpoint,
  });

  const tracerProvider = new NodeTracerProvider();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (tracerProvider as any).addSpanProcessor(new SimpleSpanProcessor(traceExporter));
  tracerProvider.register();

  otelTrace.setGlobalTracerProvider(tracerProvider);
}
