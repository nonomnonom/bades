import { parseInitialBlocknote } from '@/blocknote-editor/utils/parseInitialBlocknote';

// Note: URL signing for images happens during file upload via useUploadAttachmentFile.
// This function parses and re-stringifies the blocknote structure.
// The name is historical - actual signed URL generation happens on the server.
export const prepareBodyWithSignedUrls = (
  newStringifiedBody: string,
): string => {
  if (!newStringifiedBody) return newStringifiedBody;

  const body = parseInitialBlocknote(newStringifiedBody);

  if (!body) return newStringifiedBody;

  const bodyWithSignedPayload = body.map((block) => {
    if (block.type !== 'image' || !block.props?.url) {
      return block;
    }

    const imageUrl = block.props.url;
    const parsedImageUrl = new URL(imageUrl);

    return {
      ...block,
      props: {
        ...block.props,
        url: parsedImageUrl.toString(),
      },
    };
  });

  return JSON.stringify(bodyWithSignedPayload);
};
