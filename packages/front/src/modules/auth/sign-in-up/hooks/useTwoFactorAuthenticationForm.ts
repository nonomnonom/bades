import { zodResolver } from '@hookform/resolvers/zod';
import { t } from '~/utils/i18n/badesI18n';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const createOtpValidationSchema = () =>
  z.object({
    otp: z
      .string()
      .trim()
      .length(6, t`OTP harus tepat 6 digit`),
  });

export type OTPFormValues = z.infer<
  ReturnType<typeof createOtpValidationSchema>
>;
export const useTwoFactorAuthenticationForm = () => {
  const form = useForm<OTPFormValues>({
    mode: 'onSubmit',
    defaultValues: {
      otp: '',
    },
    resolver: zodResolver(createOtpValidationSchema()),
  });

  return { form };
};
