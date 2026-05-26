export const assertUnreachable = (_x: never, errorMessage?: string): never => {
  throw new Error(errorMessage ?? 'Tidak ada kasus yang diharapkan.');
};
