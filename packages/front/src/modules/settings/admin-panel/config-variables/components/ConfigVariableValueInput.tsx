import { useLingui } from '@lingui/react/macro';

import { isConfigVariablesInDbEnabledState } from '@/client-config/states/isConfigVariablesInDbEnabledState';
import { TextInput } from '@/ui/input/components/TextInput';
import { styled } from '@linaria/react';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { type ConfigVariableValue } from 'shared/types';
import { type ConfigVariable } from '~/generated-admin/graphql';
import { ConfigVariableDatabaseInput } from './ConfigVariableDatabaseInput';

type ConfigVariableValueInputProps = {
  variable: ConfigVariable;
  value: ConfigVariableValue;
  onChange: (value: ConfigVariableValue) => void;
  disabled?: boolean;
};

const StyledValueContainer = styled.div`
  width: 100%;
`;

export const ConfigVariableValueInput = ({
  variable,
  value,
  onChange,
  disabled,
}: ConfigVariableValueInputProps) => {
  const { t } = useLingui();
  const isConfigVariablesInDbEnabled = useAtomStateValue(
    isConfigVariablesInDbEnabledState,
  );

  return (
    <StyledValueContainer>
      {isConfigVariablesInDbEnabled && !variable.isEnvOnly ? (
        <ConfigVariableDatabaseInput
          label={"Nilai"}
          value={value}
          onChange={onChange}
          type={variable.type}
          options={variable.options}
          disabled={disabled}
          placeholder={
            disabled
              ? ""Undefined"
              : variable.isSensitive
                ? ""Enter a new secret value"
                : ""Enter a value to store in database"
          }
        />
      ) : (
        <TextInput value={String(value)} disabled label={"Nilai"} fullWidth />
      )}
    </StyledValueContainer>
  );
};
