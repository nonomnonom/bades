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
  const uploadFile = async (file: File, fieldMetadataId: string) => {
    try {
      const result = await uploadFilesFieldFile({
        variables: { file, fieldMetadataId },
      });

      const uploadedFile = result?.data?.uploadFilesFieldFile;

      if (!isDefined(uploadedFile)) {
        throw new Error(`Unggahan berkas gagal`);
      }

      const fileName = file.name;
      enqueueSuccessSnackBar({
        message: `Berkas "${fileName}" berhasil diunggah`,
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
        message: `Gagal mengunggah "${fileNameForError}"`,
      });

      throw new Error(
        `Gagal mengunggah berkas "${fileNameForError}": ${errorMessage}`,
      );
    }
  };

  return { uploadFile };
};
