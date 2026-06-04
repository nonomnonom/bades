export type FetchWithPreconnect = typeof globalThis.fetch;

type FetchImplementation = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export const asFetchWithPreconnect = (
  fetchFn: FetchImplementation,
  preconnect?: typeof globalThis.fetch.preconnect,
): FetchWithPreconnect => {
  return Object.assign(fetchFn, {
    preconnect:
      preconnect ??
      (async (_url: string | URL) => {
        return undefined;
      }),
  }) as FetchWithPreconnect;
};
