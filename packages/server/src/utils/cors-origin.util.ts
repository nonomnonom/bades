type CorsOriginCallback = (error: Error | null, allow?: boolean) => void;

const getAllowedUrls = (): string[] =>
  [process.env.FRONTEND_URL, process.env.SERVER_URL].filter(
    (url): url is string => url != null,
  );

const isLocalhostFamilyHostname = (hostname: string): boolean =>
  hostname === 'localhost' || hostname.endsWith('.localhost');

const hostnameMatchesAllowed = (
  originHostname: string,
  allowedHostname: string,
): boolean => {
  if (originHostname === allowedHostname) {
    return true;
  }

  // Dev native: FRONTEND_URL=http://localhost:3001 → izinkan app.localhost:3001,
  // desa.localhost:3001, dll. (multi-workspace subdomain di *.localhost).
  if (
    isLocalhostFamilyHostname(allowedHostname) &&
    isLocalhostFamilyHostname(originHostname)
  ) {
    return true;
  }

  const allowedDomainParts = allowedHostname.split('.');

  if (allowedDomainParts.length >= 3) {
    const baseDomain = allowedDomainParts.slice(-2).join('.');

    if (originHostname.endsWith('.' + baseDomain)) {
      return true;
    }
  }

  return false;
};

export const isOriginAllowed = (origin: string | undefined): boolean => {
  const allowedUrls = getAllowedUrls();

  if (allowedUrls.length === 0) {
    return true;
  }

  if (!origin) {
    return true;
  }

  const originHostname = new URL(origin).hostname;

  for (const allowed of allowedUrls) {
    const allowedHostname = new URL(allowed).hostname;

    if (hostnameMatchesAllowed(originHostname, allowedHostname)) {
      return true;
    }
  }

  return false;
};

export const getAllowedCorsOriginHeader = (
  requestOrigin: string | undefined,
): string | undefined => {
  const allowedUrls = getAllowedUrls();

  if (allowedUrls.length === 0) {
    return requestOrigin ?? '*';
  }

  if (requestOrigin && isOriginAllowed(requestOrigin)) {
    return requestOrigin;
  }

  return allowedUrls[0];
};

export const corsOriginCallback = (
  origin: string | undefined,
  callback: CorsOriginCallback,
): void => {
  if (isOriginAllowed(origin)) {
    callback(null, true);
    return;
  }

  callback(null, false);
};
