import { type Form } from '@/auth/sign-in-up/hooks/useSignInUpForm';
import { SignInUpMode } from '@/auth/types/signInUpMode';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { styled } from '@linaria/react';
import { m } from 'framer-motion';
import { useContext } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { StyledText } from 'ui/display';
import { ThemeContext, themeCssVariables } from 'ui/theme-constants';

const StyledFullWidthMotionDiv = styled(m.div)`
  width: 100%;
`;

const StyledInputContainer = styled.div`
  margin-bottom: ${themeCssVariables.spacing[3]};
`;

export const SignInUpPasswordField = ({
  showErrors,
  signInUpMode,
}: {
  showErrors: boolean;
  signInUpMode: SignInUpMode;
}) => {
  const { theme } = useContext(ThemeContext);
  const form = useFormContext<Form>();

  return (
    <StyledFullWidthMotionDiv
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 800,
        damping: 35,
      }}
    >
      <Controller
        name="password"
        control={form.control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <StyledInputContainer>
            <SettingsTextInput
              instanceId="sign-in-up-password"
              autoFocus
              value={value}
              type="password"
              placeholder={`Kata sandi`}
              onBlur={onBlur}
              onChange={onChange}
              error={showErrors ? error?.message : undefined}
              fullWidth
            />
            {signInUpMode === SignInUpMode.SignUp && (
              <StyledText
                text={`Minimal 8 karakter.`}
                color={theme.font.color.secondary}
              />
            )}
          </StyledInputContainer>
        )}
      />
    </StyledFullWidthMotionDiv>
  );
};
