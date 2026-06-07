export const getCurrentOrigin = (): string => window.location.origin;

export const useOrigin = () => ({
  origin: getCurrentOrigin(),
});
