import { useStore } from 'jotai';
import { useEffect } from 'react';

import { sdkClientFamilyState } from '@/front-components/states/sdkClientFamilyState';
import { fetchSdkClientBlobUrls } from '@/front-components/utils/fetchSdkClientBlobUrls';

const revokeBlobUrls = (blobUrls: { core: string; metadata: string }): void => {
  URL.revokeObjectURL(blobUrls.core);
  URL.revokeObjectURL(blobUrls.metadata);
};

export const SdkClientBlobUrlsEffect = ({
  applicationId,
  accessToken,
  onError,
}: {
  applicationId: string;
  accessToken: string;
  onError?: (error: Error) => void;
}) => {
  const store = useStore();

  useEffect(() => {
    const atom = sdkClientFamilyState.atomFamily(applicationId);
    const currentValue = store.get(atom);
    let aborted = false;

    if (currentValue.status === 'loading' || currentValue.status === 'loaded') {
      return () => {
        aborted = true;

        const value = store.get(atom);

        if (value.status === 'loaded') {
          revokeBlobUrls(value.blobUrls);
        }

        sdkClientFamilyState.removeAtom(applicationId);
      };
    }

    store.set(atom, { status: 'loading' });

    const fetchBlobUrls = async () => {
      try {
        const blobUrls = await fetchSdkClientBlobUrls(
          applicationId,
          accessToken,
        );

        if (aborted) {
          revokeBlobUrls(blobUrls);

          return;
        }

        store.set(atom, { status: 'loaded', blobUrls });
      } catch (error: unknown) {
        if (aborted) {
          return;
        }

        const normalizedError =
          error instanceof Error ? error : new Error(String(error));

        store.set(atom, { status: 'error', error: normalizedError });
        onError?.(normalizedError);
      }
    };

    fetchBlobUrls();

    return () => {
      aborted = true;

      const value = store.get(atom);

      if (value.status === 'loaded') {
        revokeBlobUrls(value.blobUrls);
      }

      sdkClientFamilyState.removeAtom(applicationId);
    };
  }, [applicationId, accessToken, store, onError]);

  return null;
};
