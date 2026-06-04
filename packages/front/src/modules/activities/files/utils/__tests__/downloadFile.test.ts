import { downloadFile } from '@/activities/files/utils/downloadFile';
import {
  getGlobalFetchMock,
  mockGlobalFetch,
  partialFetchResponse,
} from '~/testing/utils/mockGlobalFetch';
import { saveAs } from 'file-saver';

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

const mockBlob = new Blob(['test content'], { type: 'application/pdf' });

mockGlobalFetch(() =>
  Promise.resolve(
    partialFetchResponse({
      status: 200,
      blob: () => Promise.resolve(mockBlob),
    }),
  ),
);

describe('downloadFile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should download a file', async () => {
    await downloadFile('url/to/file.pdf', 'file.pdf');

    expect(fetch).toHaveBeenCalledWith('url/to/file.pdf');
    expect(saveAs).toHaveBeenCalledWith(mockBlob, 'file.pdf');
  });

  it('should reject when fetch fails', async () => {
    getGlobalFetchMock().mockResolvedValueOnce(
      partialFetchResponse({
        status: 404,
        blob: () => Promise.resolve(mockBlob),
      }),
    );

    await expect(downloadFile('url/to/file.pdf', 'file.pdf')).rejects.toBe(
      'Failed downloading file',
    );
  });
});
