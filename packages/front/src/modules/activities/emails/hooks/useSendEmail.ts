import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';
import { type EmailAttachment } from 'shared/types';

import { SEND_EMAIL } from '@/activities/emails/graphql/mutations/sendEmail';
import { useApolloCoreClient } from '@/object-metadata/hooks/useApolloCoreClient';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { t } from '~/utils/i18n/badesI18n';
import {
  type SendEmailMutation,
  type SendEmailMutationVariables,
} from '~/generated-metadata/graphql';

type SendEmailParams = {
  connectedAccountId: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  inReplyTo?: string;
  files?: EmailAttachment[];
};

export const useSendEmail = () => {
  const apolloCoreClient = useApolloCoreClient();

  const [sendEmailMutation, { loading }] = useMutation<
    SendEmailMutation,
    SendEmailMutationVariables
  >(SEND_EMAIL);

  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();

  const sendEmail = useCallback(
    async (params: SendEmailParams): Promise<boolean> => {
      try {
        const result = await sendEmailMutation({
          variables: {
            input: {
              connectedAccountId: params.connectedAccountId,
              to: params.to,
              cc: params.cc,
              bcc: params.bcc,
              subject: params.subject,
              body: params.body,
              inReplyTo: params.inReplyTo,
              files: params.files,
            },
          },
        });

        if (result.data?.sendEmail.success) {
          enqueueSuccessSnackBar({
            message: t`Email berhasil dikirim`,
          });

          await apolloCoreClient.refetchQueries({
            include: [
              'FindManyMessages',
              'FindManyMessageParticipants',
              'FindManyMessageChannelMessageAssociations',
            ],
          });

          return true;
        }

        enqueueErrorSnackBar({
          message: result.data?.sendEmail.error ?? t`Gagal mengirim email`,
        });

        return false;
      } catch {
        enqueueErrorSnackBar({
          message: t`Gagal mengirim email`,
        });

        return false;
      }
    },
    [
      sendEmailMutation,
      enqueueSuccessSnackBar,
      enqueueErrorSnackBar,
      apolloCoreClient,
    ],
  );

  return { sendEmail, loading };
};
