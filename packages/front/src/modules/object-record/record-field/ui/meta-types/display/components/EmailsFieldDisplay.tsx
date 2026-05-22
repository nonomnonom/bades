import { useLingui } from '~/utils/i18n/badesI18n';
import { useOpenEmailInAppOrFallback } from '@/activities/emails/hooks/useOpenEmailInAppOrFallback';
import { useEmailsFieldDisplay } from '@/object-record/record-field/ui/meta-types/hooks/useEmailsFieldDisplay';
import { EmailsDisplay } from '@/ui/field/display/components/EmailsDisplay';
import React from 'react';
import { FieldMetadataSettingsOnClickAction } from 'shared/types';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';

export const EmailsFieldDisplay = () => {
  const { fieldValue, fieldDefinition } = useEmailsFieldDisplay();
  const { copyToClipboard } = useCopyToClipboard();
  const { t } = useLingui();

  const onClickAction =
    fieldDefinition.metadata.settings?.clickAction ??
    FieldMetadataSettingsOnClickAction.OPEN_IN_APP;

  const isOpenInApp =
    onClickAction === FieldMetadataSettingsOnClickAction.OPEN_IN_APP;

  const { openEmail } = useOpenEmailInAppOrFallback({ skip: !isOpenInApp });

  const handleEmailClick = (
    email: string,
    event: React.MouseEvent<HTMLElement>,
  ) => {
    if (onClickAction === FieldMetadataSettingsOnClickAction.COPY) {
      event.preventDefault();
      copyToClipboard(email, t`Email berhasil disalin`);

      return;
    }

    if (isOpenInApp) {
      event.preventDefault();
      openEmail(email);

      return;
    }
  };

  return <EmailsDisplay value={fieldValue} onEmailClick={handleEmailClick} />;
};
