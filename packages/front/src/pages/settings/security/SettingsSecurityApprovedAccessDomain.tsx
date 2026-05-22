import { SaveAndCancelButtons } from '@/settings/components/SaveAndCancelButtons/SaveAndCancelButtons';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trans, useLingui } from '@lingui/react/macro';
import { Controller, useForm } from 'react-hook-form';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { H2Title } from 'ui/display';
import { Section } from 'ui/layout';
import { z } from 'zod';
import { useMutation } from '@apollo/client/react';
import { CreateApprovedAccessDomainDocument } from '~/generated-metadata/graphql';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';

export const SettingsSecurityApprovedAccessDomain = () => {
  const navigate = useNavigateSettings();

  const { t } = useLingui();

  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const [createApprovedAccessDomain] = useMutation(
    CreateApprovedAccessDomainDocument,
  );

  const form = useForm<{ domain: string; email: string }>({
    mode: 'onSubmit',
    resolver: zodResolver(
      z.strictObject({
        domain: z
          .string()
          .regex(
            /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])\.[a-zA-Z]{2,}$/,
            {
              message: t`Domain harus kurang dari 256 karakter, tidak boleh mengandung spasi dan karakter khusus.`,
            },
          )
          .max(256),
        email: z.string().min(1, {
          message: t`Surel tidak boleh kosong`,
        }),
      }),
    ),
    defaultValues: {
      email: '',
      domain: '',
    },
  });

  const domain = form.watch('domain');

  const handleSave = async () => {
    try {
      createApprovedAccessDomain({
        variables: {
          input: {
            domain: form.getValues('domain'),
            email: form.getValues('email') + '@' + form.getValues('domain'),
          },
        },
        onCompleted: () => {
          enqueueSuccessSnackBar({
            message: t`Silakan periksa surel Anda untuk tautan verifikasi.`,
          });
          navigate(SettingsPath.WorkspaceMembersPage);
        },
        onError: (error) => {
          enqueueErrorSnackBar({
            apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
          });
        },
      });
    } catch (error) {
      enqueueErrorSnackBar({
        apolloError: CombinedGraphQLErrors.is(error) ? error : undefined,
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSave)}>
      <SubMenuTopBarContainer
        title={t`Domain Akses yang Disetujui Baru`}
        actionButton={
          <SaveAndCancelButtons
            onCancel={() => navigate(SettingsPath.WorkspaceMembersPage)}
            isSaveDisabled={form.formState.isSubmitting}
          />
        }
        links={[
          {
            children: <Trans>Ruang Kerja</Trans>,
            href: getSettingsPath(SettingsPath.Workspace),
          },
          {
            children: <Trans>Anggota</Trans>,
            href: getSettingsPath(SettingsPath.WorkspaceMembersPage),
          },
          { children: <Trans>Domain Akses Baru</Trans> },
        ]}
      >
        <SettingsPageContainer>
          <Section>
            <H2Title
              title={t`Domain`}
              description={t`Nama domain Anda`}
            />
            <Controller
              name="domain"
              control={form.control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <SettingsTextInput
                  instanceId="approved-access-domain"
                  autoFocus
                  autoComplete="off"
                  value={value}
                  onChange={onChange}
                  fullWidth
                  placeholder="yourdomain.com"
                  error={error?.message}
                />
              )}
            />
          </Section>
          <Section>
            <H2Title
              title={t`Verifikasi surel`}
              description={t`Kami akan mengirimkan tautan untuk memverifikasi kepemilikan domain`}
            />
            <Controller
              name="email"
              control={form.control}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <SettingsTextInput
                  instanceId="approved-access-domain-email"
                  autoComplete="off"
                  value={value.split('@')[0]}
                  onChange={onChange}
                  fullWidth
                  error={error?.message}
                  rightAdornment={`@${domain.length !== 0 ? domain : 'your-domain.com'}`}
                />
              )}
            />
          </Section>
        </SettingsPageContainer>
      </SubMenuTopBarContainer>
    </form>
  );
};
