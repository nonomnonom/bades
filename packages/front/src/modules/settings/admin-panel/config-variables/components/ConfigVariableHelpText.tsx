import { styled } from '@linaria/react';
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
  const isFromDatabase = variable.source === ConfigSource.DATABASE;
  const isFromEnvironment = variable.source === ConfigSource.ENVIRONMENT;
  const isReadOnly = !isConfigVariablesInDbEnabled;

  if (isReadOnly) {
    return (
      <StyledHelpText>
        {`Konfigurasi database saat ini dinonaktifkan.`}{' '}
        {isFromEnvironment
          ? `Nilai diatur di environment server, mungkin berbeda di worker.`
          : `Menggunakan nilai default aplikasi. Konfigurasikan melalui variabel environment.`}
      </StyledHelpText>
    );
  }

  if (isConfigVariablesInDbEnabled && variable.isEnvOnly) {
    return (
      <StyledHelpText>
        {`Pengaturan ini hanya dapat dikonfigurasi melalui variabel environment.`}
      </StyledHelpText>
    );
  }

  if (isConfigVariablesInDbEnabled && !variable.isEnvOnly && hasValueChanged) {
    return (
      <StyledHelpText>
        {isFromDatabase
          ? `Klik tanda centang untuk menerapkan perubahan Anda.`
          : `Nilai ini akan disimpan ke database.`}
      </StyledHelpText>
    );
  }

  if (isConfigVariablesInDbEnabled && !variable.isEnvOnly && !hasValueChanged) {
    if (isFromDatabase) {
      return (
        <>
          <StyledHelpText>
            {`Nilai database ini menggantikan pengaturan environment. `}
          </StyledHelpText>
          <StyledHelpText>
            {`Kosongkan kolom atau tekan "X" untuk kembali ke nilai environment/default.`}
          </StyledHelpText>
        </>
      );
    } else {
      return (
        <StyledHelpText>
          {isFromEnvironment
            ? `Nilai saat ini berasal dari environment server. Atur nilai kustom untuk menggantikannya.`
            : `Menggunakan nilai default. Atur nilai kustom untuk menggantikannya.`}
        </StyledHelpText>
      );
    }
  }

  return <StyledHelpText>{`Ini seharusnya tidak terjadi`}</StyledHelpText>;
};
