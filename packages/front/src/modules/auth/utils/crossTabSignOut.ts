const SIGN_OUT_CHANNEL_NAME = 'bades-sign-out';
const REFRESH_CHANNEL_NAME = 'bades-token-refresh';

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

export const subscribeToSignOutFromOtherTabs = (
  callback: () => void,
): (() => void) => {
  const channel = getSharedSignOutChannel();

  if (!channel) {
    return () => {};
  }

  channel.onmessage = (event: MessageEvent) => {
    if (event.data?.type === 'sign-out') {
      callback();
    }
  };

  return () => {
    channel.onmessage = null;
  };
};

/**
 * Token refresh coordination across tabs.
 * When one tab is refreshing, other tabs wait for it to complete.
 */

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

export const broadcastRefreshStart = () => {
  isRefreshing = true;
  getSharedRefreshChannel()?.postMessage({ type: 'REFRESH_START' });
};

export const broadcastRefreshComplete = () => {
  isRefreshing = false;
  getSharedRefreshChannel()?.postMessage({ type: 'REFRESH_COMPLETE' });
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

export const waitForRefreshComplete = (): Promise<void> => {
  if (!isRefreshing) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    refreshSubscribers.push(resolve);
  });
};

export const subscribeToRefreshFromOtherTabs = (
  onRefreshStart: () => void,
  onRefreshComplete: () => void,
): (() => void) => {
  const channel = getSharedRefreshChannel();

  if (!channel) {
    return () => {};
  }

  channel.onmessage = (event: MessageEvent) => {
    if (event.data?.type === 'REFRESH_START') {
      onRefreshStart();
    } else if (event.data?.type === 'REFRESH_COMPLETE') {
      onRefreshComplete();
    }
  };

  return () => {
    channel.onmessage = null;
  };
};
