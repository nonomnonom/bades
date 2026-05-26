import { ConfigVariablesMaskingStrategies } from 'src/engine/core-modules/bades-config/enums/config-variables-masking-strategies.enum';

export const configVariableMaskSensitiveData = (
  value: string,
  strategy: ConfigVariablesMaskingStrategies,
  options?: { chars?: number; variableName?: string },
): string => {
  if (!value || typeof value !== 'string') return value;
  switch (strategy) {
    case ConfigVariablesMaskingStrategies.LAST_N_CHARS: {
      const n = Math.max(1, options?.chars ?? 5);

      return value.length > n ? `********${value.slice(-n)}` : '********';
    }

    case ConfigVariablesMaskingStrategies.HIDE_PASSWORD: {
      try {
        const url = new URL(value);

        if (url.password) {
          url.password = '********';
        }
        if (url.username) {
          url.username = '********';
        }

        return url.toString();
      } catch {
        throw new Error(
          `Format URL tidak valid untuk ${options?.variableName || 'config variable'} dalam strategi masking HIDE_PASSWORD`,
        );
      }
    }

    default:
      return value;
  }
};
