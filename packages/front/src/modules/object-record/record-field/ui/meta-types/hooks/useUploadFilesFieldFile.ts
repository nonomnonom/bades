import { useLingui } from '~/utils/i18n/badesI18n';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useApolloClient, useMutation } from '@apollo/client/react';
import { isDefined } from 'shared/utils';
import { UploadFilesFieldFileDocument } from '~/generated-metadata/graphql';

const DEFAULT_VALUE_BEFORE_SERVER_RESPONSE =
  'default-value-before-server-response';

export const useUploadFilesFieldFile = () => {
  const apolloClient = useApolloClient();
  const [uploadFilesFieldFile] = useMutation(UploadFilesFieldFileDocument, {
    client: apolloClient,
  });
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const { t } = useLingui();

  const uploadFile = async (file: File, fieldMetadataId: string) => {
    try {
      const result = await uploadFilesFieldFile({
        variables: { file, fieldMetadataId },
      });

      const uploadedFile = result?.data?.uploadFilesFieldFile;

      if (!isDefined(uploadedFile)) {
        throw new Error(t`Unggahan berkas gagal`);
      }

      const fileName = file.name;
      enqueueSuccessSnackBar({
        message: t`Berkas "${fileName}" berhasil diunggah`,
      });

      return {
        fileId: uploadedFile.id,
        label: file.name,
        extension: DEFAULT_VALUE_BEFORE_SERVER_RESPONSE,
        url: DEFAULT_VALUE_BEFORE_SERVER_RESPONSE,
      };
    } catch (error) {
      const fileNameForError = file.name;
      const errorMessage = String(error);
      enqueueErrorSnackBar({
        message: t`Gagal mengunggah "${fileNameForError}"`,
      });

      throw new Error(
        t`Gagal mengunggah berkas "${fileNameForError}": ${errorMessage}`,
      );
    }
  };

  return { uploadFile };
};
