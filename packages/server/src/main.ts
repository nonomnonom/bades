import { NestFactory } from '@nestjs/core';
import { type NestExpressApplication } from '@nestjs/platform-express';

import fs from 'fs';

import bytes from 'bytes';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import session from 'express-session';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';

import { NodeEnvironment } from 'src/engine/core-modules/bades-config/interfaces/node-environment.interface';

import { setPgDateTypeParser } from 'src/database/pg/set-pg-date-type-parser';
import { LoggerService } from 'src/engine/core-modules/logger/logger.service';
import { getSessionStorageOptions } from 'src/engine/core-modules/session-storage/session-storage.module-factory';
import { BadesConfigService } from 'src/engine/core-modules/bades-config/bades-config.service';
import { configTransformers } from 'src/engine/core-modules/bades-config/utils/config-transformers.util';
import { UnhandledExceptionFilter } from 'src/filters/unhandled-exception.filter';

import { AppModule } from './app.module';
import './instrument';

import { settings } from './engine/constants/settings';
import { generateFrontConfig } from './utils/generate-front-config';

// Trigger
const bootstrap = async () => {
  setPgDateTypeParser();

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Expose WWW-Authenticate so browser-based MCP clients can read the
    // resource_metadata pointer on 401. Required by MCP authorization spec.
    cors: {
      origin: (origin, callback) => {
        const FRONTEND_URL = process.env.FRONTEND_URL;
        const SERVER_URL = process.env.SERVER_URL;
        const allowedUrls: string[] = [FRONTEND_URL, SERVER_URL].filter(
          (url): url is string => url != null,
        );

        // Fallback development: izinkan localhost
        if (allowedUrls.length === 0) {
          return callback(null, true);
        }

        // Izinkan request tanpa origin (server-to-server, mobile apps, Postman)
        if (!origin) {
          return callback(null, true);
        }

        const originHostname = new URL(origin).hostname;

        // Cocokkan hostname secara eksplisit untuk mencegah subdomain spoofing
        for (const allowed of allowedUrls) {
          const allowedHostname = new URL(allowed).hostname;

          if (originHostname === allowedHostname) {
            return callback(null, true);
          }

          // Dukungan multi-tenant: izinkan subdomain dari domain utama
          const allowedDomainParts = allowedHostname.split('.');

          if (allowedDomainParts.length >= 3) {
            const baseDomain = allowedDomainParts.slice(-2).join('.');

            if (originHostname.endsWith('.' + baseDomain)) {
              return callback(null, true);
            }
          }
        }

        callback(null, false);
      },
      exposedHeaders: ['WWW-Authenticate'],
    },
    bufferLogs: process.env.LOGGER_IS_BUFFER_ENABLED === 'true',
    rawBody: true,
    snapshot: process.env.NODE_ENV === NodeEnvironment.DEVELOPMENT,
    ...(process.env.SSL_KEY_PATH && process.env.SSL_CERT_PATH
      ? {
          httpsOptions: {
            key: fs.readFileSync(process.env.SSL_KEY_PATH),
            cert: fs.readFileSync(process.env.SSL_CERT_PATH),
          },
        }
      : {}),
  });
  const logger = app.get(LoggerService);
  const badesConfigService = app.get(BadesConfigService);

  const trustProxyRaw = badesConfigService.get('TRUST_PROXY');
  const trustProxy = /^\d+$/.test(trustProxyRaw)
    ? Number(trustProxyRaw)
    : (configTransformers.boolean(trustProxyRaw) ?? trustProxyRaw);

  app.set('trust proxy', trustProxy);

  // HTTP security headers — CSP untuk production hardening.
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          // 'unsafe-eval' diperlukan untuk Monaco editor (CodeMirror).
          // 'unsafe-inline' diperlukan untuk dynamic script loading di workflow engine.
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            'https://challenges.cloudflare.com',
            'https://www.google.com',
            'https://www.gstatic.com',
          ],
          // 'unsafe-inline' diperlukan karena Linaria meng-generate inline <style>.
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
          connectSrc: [
            "'self'",
            'https://*.tiles.mapbox.com',
            'https://api.mapbox.com',
            'https://events.mapbox.com',
            'https://*.ingest.sentry.io',
            'https://challenges.cloudflare.com',
            'https://www.google.com',
          ],
          fontSrc: ["'self'", 'data:'],
          frameSrc: [
            "'self'",
            'https://challenges.cloudflare.com',
            'https://www.google.com',
          ],
          frameAncestors: ["'self'"],
          workerSrc: ["'self'", 'blob:'],
          mediaSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use(session(getSessionStorageOptions(badesConfigService)));

  // Apply class-validator container so that we can use injection in validators
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Use our logger
  app.useLogger(logger);

  app.useGlobalFilters(new UnhandledExceptionFilter());

  app.useBodyParser('json', { limit: settings.storage.maxFileSize });
  app.useBodyParser('urlencoded', {
    limit: settings.storage.maxFileSize,
    extended: true,
  });
  app.useBodyParser('text', { type: 'text/plain', limit: '1024kb' });

  // Graphql file upload
  app.use(
    '/graphql',
    graphqlUploadExpress({
      maxFieldSize: bytes(settings.storage.maxFileSize)!,
      maxFiles: 10,
    }),
  );

  app.use(
    '/metadata',
    graphqlUploadExpress({
      maxFieldSize: bytes(settings.storage.maxFileSize)!,
      maxFiles: 10,
    }),
  );

  // Inject the server url in the frontend page
  generateFrontConfig();

  await app.listen(badesConfigService.get('NODE_PORT'));
};

void bootstrap();
