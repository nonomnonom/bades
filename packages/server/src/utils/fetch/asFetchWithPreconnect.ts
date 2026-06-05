export type FetchWithPreconnect = typeof globalThis.fetch & {
  preconnect?: (url: string | URL) => Promise<void>;
};

type FetchImplementation = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export const asFetchWithPreconnect = (
  fetchFn: FetchImplementation,
  preconnect?: (url: string | URL) => Promise<void>,
): FetchWithPreconnect => {
  return Object.assign(fetchFn, {
    preconnect:
      preconnect ??
      (async (_url: string | URL) => {
        return undefined;
      }),
  }) as FetchWithPreconnect;
};
