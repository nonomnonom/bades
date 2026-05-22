import { SaveAndCancelButtons } from '@/settings/components/SaveAndCancelButtons/SaveAndCancelButtons';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { SettingsTextInput } from '@/ui/input/components/SettingsTextInput';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { Trans, useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined } from 'shared/utils';
import { H2Title } from 'ui/display';
import { Section } from 'ui/layout';
import { useMutation } from '@apollo/client/react';
import {
  EmailingDomainDriver,
  CreateEmailingDomainDocument,
} from '~/generated-metadata/graphql';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';
import {
  settingsEmailingDomainFormSchema,
  type SettingsEmailingDomainFormValues,
} from '~/pages/settings/emailing-domains/validation-schemas/settingsEmailingDomainFormSchema';

type FieldErrors = Partial<
  Record<keyof SettingsEmailingDomainFormValues, string>
>;
export const SettingsNewEmailingDomain = () => {
  const navigate = useNavigateSettings();
  const { t } = useLingui();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const [formValues, setFormValues] =
    useState<SettingsEmailingDomainFormValues>({
      driver: EmailingDomainDriver.AWS_SES,
      domain: '',
    });

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createEmailingDomain] = useMutation(CreateEmailingDomainDocument);

  const validateForm = (): boolean => {
    const result = settingsEmailingDomainFormSchema.safeParse(formValues);

    if (!result.success) {
      setFieldErrors(result.error?.flatten().fieldErrors as FieldErrors);
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const handleFieldChange = (
    field: keyof SettingsEmailingDomainFormValues,
    value: string | EmailingDomainDriver,
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (isDefined(fieldErrors[field])) {
      setFieldErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const canSave = !isSubmitting;

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createEmailingDomain({
        variables: {
          domain: formValues.domain,
          driver: formValues.driver,
        },
        onCompleted: (data) => {
          enqueueSuccessSnackBar({
            message: t`Domain pengiriman surel berhasil dibuat. Verifikasi domain untuk mulai menggunakannya.`,
          });
          if (!data.createEmailingDomain?.id) return;

          navigate(SettingsPath.EmailingDomainDetail, {
            domainId: data.createEmailingDomain.id,
          });
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SubMenuTopBarContainer
      title={t`Domain Pengiriman Surel Baru`}
      actionButton={
        <SaveAndCancelButtons
          onCancel={() => navigate(SettingsPath.Applications)}
          onSave={handleSave}
          isSaveDisabled={!canSave}
        />
      }
      links={[
        {
          children: <Trans>Ruang Kerja</Trans>,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        {
          children: <Trans>Aplikasi</Trans>,
          href: getSettingsPath(SettingsPath.Applications),
        },
        {
          children: <Trans>Domain Pengiriman Surel</Trans>,
          href: getSettingsPath(SettingsPath.Applications),
        },
        { children: <Trans>Domain Baru</Trans> },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <H2Title
            title={t`Domain`}
            description={t`Nama domain yang ingin digunakan untuk pengiriman surel`}
          />
          <SettingsTextInput
            instanceId="emailing-domain"
            autoFocus
            autoComplete="off"
            value={formValues.domain}
            onChange={(value) => handleFieldChange('domain', value)}
            fullWidth
            placeholder="yourdomain.com"
            error={fieldErrors.domain}
          />
        </Section>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
