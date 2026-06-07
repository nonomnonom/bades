type CorsOriginCallback = (error: Error | null, allow?: boolean) => void;

const getAllowedUrls = (): string[] =>
  [process.env.FRONTEND_URL, process.env.SERVER_URL].filter(
    (url): url is string => url != null,
  );

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

    if (originHostname === allowedHostname) {
      return true;
    }

    const allowedDomainParts = allowedHostname.split('.');

    if (allowedDomainParts.length >= 3) {
      const baseDomain = allowedDomainParts.slice(-2).join('.');

      if (originHostname.endsWith('.' + baseDomain)) {
        return true;
      }
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
