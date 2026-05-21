import { useLingui } from '@lingui/react/macro';
import { useContext } from 'react';
import { CustomError } from 'shared/utils';
import { ThemeContext } from 'ui/theme-constants';

import { ConfigSource } from '~/generated-admin/graphql';

export const useSourceContent = (source: ConfigSource) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useLingui();

  switch (source) {
    case ConfigSource.DATABASE:
      return {
        text: ""Stored in database",
        color: theme.color.blue10,
      };
    case ConfigSource.ENVIRONMENT:
      return {
        text: ""Environment variable",
        color: theme.color.green10,
      };
    case ConfigSource.DEFAULT:
      return {
        text: ""Default value",
        color: theme.font.color.tertiary,
      };
    default:
      throw new CustomError(`Unknown source: ${source}`, 'UNKNOWN_SOURCE');
  }
};
