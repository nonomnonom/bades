import { useLingui } from '~/utils/i18n/badesI18n';

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
          label={t`Value`}
          value={value}
          onChange={onChange}
          type={variable.type}
          options={variable.options}
          disabled={disabled}
          placeholder={
            disabled
              ? t`Tidak terdefinisi`
              : variable.isSensitive
                ? t`Masukkan nilai rahasia baru`
                : t`Masukkan nilai untuk disimpan di database`
          }
        />
      ) : (
        <TextInput value={String(value)} disabled label={t`Nilai`} fullWidth />
      )}
    </StyledValueContainer>
  );
};
