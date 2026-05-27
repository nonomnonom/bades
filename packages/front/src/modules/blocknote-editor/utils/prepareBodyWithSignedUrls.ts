import { parseInitialBlocknote } from '@/blocknote-editor/utils/parseInitialBlocknote';

// TODO: fungsi ini hanya mem-parse URL gambar, belum benar-benar menandatanganinya
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
