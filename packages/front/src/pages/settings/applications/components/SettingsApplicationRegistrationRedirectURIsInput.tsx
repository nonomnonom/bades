import { useLingui } from '~/utils/i18n/badesI18n';
import { styled } from '@linaria/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { Button } from 'ui/input';
import { themeCssVariables } from 'ui/theme-constants';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledLinkContainer = styled.div`
  flex: 1;
  margin-right: ${themeCssVariables.spacing[2]};
`;

type SettingsApplicationRegistrationRedirectURIsInputProps = {
  updateRedirectUris: (newRedirectUris: string[]) => void;
  redirectUris: string[];
};

type FormInput = {
  redirectUri: string;
};

export const SettingsApplicationRegistrationRedirectURIsInput = ({
  updateRedirectUris,
  redirectUris,
}: SettingsApplicationRegistrationRedirectURIsInputProps) => {
  const { t } = useLingui();

  const validationSchema = (redirectUris: string[]) =>
    z
      .object({
        redirectUri: z
          .string()
          .trim()
          .min(1, 'URI wajib diisi')
          .url(t`Masukkan URL yang valid`)
          .refine(
            (value) => !redirectUris.includes(value),
            t`URI sudah ada dalam daftar Redirect URI`,
          ),
      })
      .required();

  const { reset, handleSubmit, control, formState } = useForm<FormInput>({
    mode: 'onSubmit',
    resolver: zodResolver(validationSchema(redirectUris)),
    defaultValues: {
      redirectUri: '',
    },
  });

  const submit = handleSubmit((data) => {
    updateRedirectUris([...redirectUris, data.redirectUri]);
  });

  const { isSubmitSuccessful } = formState;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return (
    <form onSubmit={submit}>
      <StyledContainer>
        <StyledLinkContainer>
          <Controller
            name="redirectUri"
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <SettingsTextInput
                instanceId="settings-application-registration-redirect-uris-input"
                placeholder={""https://example.com/callback"}
                value={value}
                onChange={onChange}
                error={error?.message}
                fullWidth
              />
            )}
          />
        </StyledLinkContainer>
        <Button title={t`Tambah URI`} type="submit" />
      </StyledContainer>
    </form>
  );
};
