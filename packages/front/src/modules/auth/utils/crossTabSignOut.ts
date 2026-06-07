const SIGN_OUT_CHANNEL_NAME = 'bades-sign-out';
const REFRESH_CHANNEL_NAME = 'bades-token-refresh';

export const REFRESH_WAIT_TIMEOUT_MS = 15_000;

let sharedSignOutChannel: BroadcastChannel | null = null;
let sharedRefreshChannel: BroadcastChannel | null = null;

const getSharedSignOutChannel = (): BroadcastChannel | null => {
  if (sharedSignOutChannel) {
    return sharedSignOutChannel;
  }

  try {
    sharedSignOutChannel = new BroadcastChannel(SIGN_OUT_CHANNEL_NAME);
  } catch {
    return null;
  }

  return sharedSignOutChannel;
};

const getSharedRefreshChannel = (): BroadcastChannel | null => {
  if (sharedRefreshChannel) {
    return sharedRefreshChannel;
  }

  try {
    sharedRefreshChannel = new BroadcastChannel(REFRESH_CHANNEL_NAME);
  } catch {
    return null;
  }

  return sharedRefreshChannel;
};

export const broadcastSignOutToOtherTabs = () => {
  getSharedSignOutChannel()?.postMessage({ type: 'sign-out' });
};

export const broadcastSessionInvalidatedToOtherTabs = () => {
  getSharedSignOutChannel()?.postMessage({ type: 'session-invalidated' });
};

export const subscribeToSignOutFromOtherTabs = (
  callback: () => void,
): (() => void) => {
  const channel = getSharedSignOutChannel();

  if (!channel) {
    return () => {};
  }

  const handler = (event: MessageEvent) => {
    if (event.data?.type === 'sign-out') {
      callback();
    }
  };

  channel.addEventListener('message', handler);

  return () => {
    channel.removeEventListener('message', handler);
  };
};

export const subscribeToSessionInvalidatedFromOtherTabs = (
  callback: () => void,
): (() => void) => {
  const channel = getSharedSignOutChannel();

  if (!channel) {
    return () => {};
  }

  const handler = (event: MessageEvent) => {
    if (event.data?.type === 'session-invalidated') {
      callback();
    }
  };

  channel.addEventListener('message', handler);

  return () => {
    channel.removeEventListener('message', handler);
  };
};

/**
 * Token refresh coordination across tabs.
 * When one tab is refreshing, other tabs wait for it to complete.
 */

let isRefreshing = false;
let remoteTabIsRefreshing = false;
let refreshWaiters: (() => void)[] = [];

const resetRefreshFlags = () => {
  isRefreshing = false;
  remoteTabIsRefreshing = false;
};

export const resolveRefreshWaiters = () => {
  refreshWaiters.forEach((resolve) => resolve());
  refreshWaiters = [];
};

const initCrossTabRefreshListener = (): void => {
  const channel = getSharedRefreshChannel();

  if (!channel) {
    return;
  }

  channel.addEventListener('message', (event: MessageEvent) => {
    if (event.data?.type === 'REFRESH_START') {
      remoteTabIsRefreshing = true;
    } else if (event.data?.type === 'REFRESH_COMPLETE') {
      remoteTabIsRefreshing = false;
      resolveRefreshWaiters();
    }
  });
};

initCrossTabRefreshListener();

export const isAnyTabRefreshing = (): boolean =>
  isRefreshing || remoteTabIsRefreshing;

export const broadcastRefreshStart = () => {
  isRefreshing = true;
  getSharedRefreshChannel()?.postMessage({ type: 'REFRESH_START' });
};

export const broadcastRefreshComplete = () => {
  resetRefreshFlags();
  getSharedRefreshChannel()?.postMessage({ type: 'REFRESH_COMPLETE' });
  resolveRefreshWaiters();
};

export const waitForRefreshComplete = (): Promise<void> => {
  if (!isAnyTabRefreshing()) {
    return Promise.resolve();
  }

  return Promise.race([
    new Promise<void>((resolve) => {
      refreshWaiters.push(resolve);
    }),
    new Promise<void>((resolve) => {
      setTimeout(() => {
        resetRefreshFlags();
        resolveRefreshWaiters();
        resolve();
      }, REFRESH_WAIT_TIMEOUT_MS);
    }),
  ]);
};

export const subscribeToRefreshFromOtherTabs = (
  onRefreshStart: () => void,
  onRefreshComplete: () => void,
): (() => void) => {
  const channel = getSharedRefreshChannel();

  if (!channel) {
    return () => {};
  }

  const handler = (event: MessageEvent) => {
    if (event.data?.type === 'REFRESH_START') {
      onRefreshStart();
    } else if (event.data?.type === 'REFRESH_COMPLETE') {
      onRefreshComplete();
    }
  };

  channel.addEventListener('message', handler);

  return () => {
    channel.removeEventListener('message', handler);
  };
};

/** Hanya untuk test — reset state modul antar-tab. */
export const resetCrossTabAuthStateForTesting = () => {
  resetRefreshFlags();
  resolveRefreshWaiters();
};
