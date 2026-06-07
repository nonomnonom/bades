import {
  REFRESH_WAIT_TIMEOUT_MS,
  broadcastRefreshComplete,
  broadcastRefreshStart,
  resetCrossTabAuthStateForTesting,
  resolveRefreshWaiters,
  waitForRefreshComplete,
} from '@/auth/utils/crossTabSignOut';

describe('crossTabSignOut refresh coordination', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetCrossTabAuthStateForTesting();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('waitForRefreshComplete selesai langsung saat tidak ada refresh', async () => {
    await expect(waitForRefreshComplete()).resolves.toBeUndefined();
  });

  it('waitForRefreshComplete menunggu sampai refresh selesai', async () => {
    broadcastRefreshStart();

    const waitPromise = waitForRefreshComplete();

    broadcastRefreshComplete();

    await expect(waitPromise).resolves.toBeUndefined();
  });

  it('waitForRefreshComplete timeout reset flag refresh yang macet', async () => {
    broadcastRefreshStart();

    const waitPromise = waitForRefreshComplete();

    jest.advanceTimersByTime(REFRESH_WAIT_TIMEOUT_MS);

    await expect(waitPromise).resolves.toBeUndefined();
  });

  it('resolveRefreshWaiters membebaskan semua waiter', async () => {
    broadcastRefreshStart();

    const firstWait = waitForRefreshComplete();
    const secondWait = waitForRefreshComplete();

    resolveRefreshWaiters();

    await expect(firstWait).resolves.toBeUndefined();
    await expect(secondWait).resolves.toBeUndefined();
  });
});
