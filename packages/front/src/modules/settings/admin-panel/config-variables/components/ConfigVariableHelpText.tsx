import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';

import { isConfigVariablesInDbEnabledState } from '@/client-config/states/isConfigVariablesInDbEnabledState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { themeCssVariables } from 'ui/theme-constants';
import { ConfigSource, type ConfigVariable } from '~/generated-admin/graphql';

const StyledHelpText = styled.div<{ color?: string }>`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
  line-height: 1.5;
`;

type ConfigVariableHelpTextProps = {
  variable: ConfigVariable;
  hasValueChanged: boolean;
  color?: string;
};

export const ConfigVariableHelpText = ({
  variable,
  hasValueChanged,
}: ConfigVariableHelpTextProps) => {
  const isConfigVariablesInDbEnabled = useAtomStateValue(
    isConfigVariablesInDbEnabledState,
  );
  const { t } = useLingui();
  const isFromDatabase = variable.source === ConfigSource.DATABASE;
  const isFromEnvironment = variable.source === ConfigSource.ENVIRONMENT;
  const isReadOnly = !isConfigVariablesInDbEnabled;

  if (isReadOnly) {
    return (
      <StyledHelpText>
        {""Database configuration is currently disabled."}{' '}
        {isFromEnvironment
          ? ""Value is set in the server environment, it may be a different value on the worker."
          : ""Using default application value. Configure via environment variables."}
      </StyledHelpText>
    );
  }

  if (isConfigVariablesInDbEnabled && variable.isEnvOnly) {
    return (
      <StyledHelpText>
        {""This setting can only be configured through environment variables."}
      </StyledHelpText>
    );
  }

  if (isConfigVariablesInDbEnabled && !variable.isEnvOnly && hasValueChanged) {
    return (
      <StyledHelpText>
        {isFromDatabase
          ? ""Click on the checkmark to apply your changes."
          : ""This value will be saved to the database."}
      </StyledHelpText>
    );
  }

  if (isConfigVariablesInDbEnabled && !variable.isEnvOnly && !hasValueChanged) {
    if (isFromDatabase) {
      return (
        <>
          <StyledHelpText>
            {t`This database value overrides environment settings. `}
          </StyledHelpText>
          <StyledHelpText>
            {""Clear the field or "X" to revert to environment/default value."}
          </StyledHelpText>
        </>
      );
    } else {
      return (
        <StyledHelpText>
          {isFromEnvironment
            ? ""Current value from server environment. Set a custom value to override."
            : ""Using default value. Set a custom value to override."}
        </StyledHelpText>
      );
    }
  }

  return <StyledHelpText>{""This should never happen"}</StyledHelpText>;
};
