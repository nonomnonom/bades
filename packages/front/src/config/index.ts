const isLocalDevelopmentHost = () =>
  window.location.hostname.endsWith('localhost') ||
  window.location.hostname.endsWith('127.0.0.1');

const getDefaultUrl = () => {
  if (isLocalDevelopmentHost()) {
    // In development environment front and backend usually run on separate ports
    // we set the default value to localhost:3000.
    // In dev context, we use env vars to overwrite it
    return `http://${window.location.hostname}:3000`;
  }

  // Outside of localhost the backend serves the frontend on the same host.
  // Multi-workspace subdomains (e.g. nonom.bades.id) must call their own origin
  // so CSP connect-src 'self' and auth cookies stay valid.
  return `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? `:${window.location.port}` : ''
  }`;
};

const getServerBaseUrl = () => {
  if (!isLocalDevelopmentHost()) {
    return getDefaultUrl();
  }

  return window._env_?.REACT_APP_SERVER_BASE_URL || getDefaultUrl();
};

export const REACT_APP_SERVER_BASE_URL = getServerBaseUrl();
