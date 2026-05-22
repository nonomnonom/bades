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
        {t`Konfigurasi database saat ini dinonaktifkan.`}{' '}
        {isFromEnvironment
          ? t`Nilai diatur di environment server, mungkin berbeda di worker.`
          : t`Menggunakan nilai default aplikasi. Konfigurasikan melalui variabel environment.`}
      </StyledHelpText>
    );
  }

  if (isConfigVariablesInDbEnabled && variable.isEnvOnly) {
    return (
      <StyledHelpText>
        {t`Pengaturan ini hanya dapat dikonfigurasi melalui variabel environment.`}
      </StyledHelpText>
    );
  }

  if (isConfigVariablesInDbEnabled && !variable.isEnvOnly && hasValueChanged) {
    return (
      <StyledHelpText>
        {isFromDatabase
          ? t`Klik tanda centang untuk menerapkan perubahan Anda.`
          : t`Nilai ini akan disimpan ke database.`}
      </StyledHelpText>
    );
  }

  if (isConfigVariablesInDbEnabled && !variable.isEnvOnly && !hasValueChanged) {
    if (isFromDatabase) {
      return (
        <>
          <StyledHelpText>
            {t`Nilai database ini menggantikan pengaturan environment. `}
          </StyledHelpText>
          <StyledHelpText>
            {t`Kosongkan kolom atau tekan "X" untuk kembali ke nilai environment/default.`}
          </StyledHelpText>
        </>
      );
    } else {
      return (
        <StyledHelpText>
          {isFromEnvironment
            ? t`Nilai saat ini berasal dari environment server. Atur nilai kustom untuk menggantikannya.`
            : t`Menggunakan nilai default. Atur nilai kustom untuk menggantikannya.`}
        </StyledHelpText>
      );
    }
  }

  return <StyledHelpText>{t`Ini seharusnya tidak terjadi`}</StyledHelpText>;
};
