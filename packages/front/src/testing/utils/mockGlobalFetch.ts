type FetchMock = jest.MockedFunction<typeof fetch>;

const attachFetchMockStatics = (mock: FetchMock): FetchMock => {
  mock.preconnect = jest.fn(async () => undefined) as typeof fetch.preconnect;
  return mock;
};

export const createFetchMock = (
  implementation?: (
    ...args: Parameters<typeof fetch>
  ) => ReturnType<typeof fetch>,
): FetchMock => {
  const mock = (implementation
    ? jest.fn(implementation)
    : jest.fn()) as unknown as FetchMock;

  return attachFetchMockStatics(mock);
};

export const mockGlobalFetch = (
  implementation?: (
    ...args: Parameters<typeof fetch>
  ) => ReturnType<typeof fetch>,
): FetchMock => {
  const mock = createFetchMock(implementation);
  global.fetch = mock;
  return mock;
};

export const getGlobalFetchMock = (): FetchMock => {
  return global.fetch as FetchMock;
};

/** Mock Response parsial untuk test — hindari error TS saat mock fetch diperketat. */
export const partialFetchResponse = (init: Partial<Response>): Response =>
  init as Response;
