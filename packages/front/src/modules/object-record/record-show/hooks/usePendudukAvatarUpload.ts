import { t } from '~/utils/i18n/badesI18n';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { useApolloClient, useMutation } from '@apollo/client/react';
import { assertIsDefinedOrThrow, isDefined } from 'shared/utils';
import {
  FieldMetadataType,
  UploadFilesFieldFileDocument,
} from '~/generated-metadata/graphql';

export const usePendudukAvatarUpload = (pendudukRecordId: string) => {
  const apolloClient = useApolloClient();
  const [uploadFilesFieldFile] = useMutation(UploadFilesFieldFileDocument, {
    client: apolloClient,
  });
  const { updateOneRecord } = useUpdateOneRecord();

  const { objectMetadataItem: pendudukMetadata } = useObjectMetadataItem({
    objectNameSingular: 'penduduk',
  });

  const avatarFileFieldMetadataId = pendudukMetadata.fields.find(
    (field) =>
      field.type === FieldMetadataType.FILES && field.name === 'avatarFile',
  )?.id;

  const onUploadPicture = async (file: File) => {
    assertIsDefinedOrThrow(
      avatarFileFieldMetadataId,
      new Error(t`Kolom berkas avatar tidak ditemukan untuk objek penduduk`),
    );

    const result = await uploadFilesFieldFile({
      variables: { file, fieldMetadataId: avatarFileFieldMetadataId },
    });

    const uploadedFile = result?.data?.uploadFilesFieldFile;

    if (!isDefined(uploadedFile)) {
      return;
    }

    await updateOneRecord({
      objectNameSingular: 'penduduk',
      idToUpdate: pendudukRecordId,
      updateOneRecordInput: {
        avatarFile: [
          {
            fileId: uploadedFile.id,
            label: file.name,
          },
        ],
      },
    });
  };

  return { onUploadPicture };
};
