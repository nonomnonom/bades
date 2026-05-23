import { type Preview } from '@storybook/react-vite';
import { initialize, mswLoader } from 'msw-storybook-addon';
// oxlint-disable-next-line no-restricted-imports
import { I18nProvider } from '../src/utils/i18n/badesI18n';

// oxlint-disable-next-line no-restricted-imports
import { FileUploadProvider } from '../src/modules/file-upload/components/FileUploadProvider';
// oxlint-disable-next-line no-restricted-imports
import { RootDecorator } from '../src/testing/decorators/RootDecorator';
// oxlint-disable-next-line no-restricted-imports
import { resetJotaiStore } from '../src/modules/ui/utilities/state/jotai/jotaiStore';

import 'react-loading-skeleton/dist/skeleton.css';
import 'ui/style.css';
import 'ui/theme-light.css';
import 'ui/theme-dark.css';
import { ThemeProvider } from 'ui/theme-constants';
import { mockedUserJWT } from '~/testing/mock-data/jwt';
// oxlint-disable-next-line no-restricted-imports
import { ClickOutsideListenerContext } from '../src/modules/ui/utilities/pointer-event/contexts/ClickOutsideListenerContext';

initialize({
  onUnhandledRequest: async (request: Request) => {
    const fileExtensionsToIgnore =
      /\.(ts|tsx|js|jsx|svg|css|png|woff2)(\?v=[a-zA-Z0-9]+)?/;

    if (fileExtensionsToIgnore.test(request.url)) {
      return;
    }

    if (request.url.startsWith('http://localhost:3000/files/')) {
      return;
    }

    try {
      const requestBody = await request.json();

      // oxlint-disable-next-line no-console
      console.warn(`Unhandled ${request.method} request to ${request.url}
        with payload ${JSON.stringify(requestBody)}\n
        This request should be mocked with MSW`);
    } catch (error) {
      // oxlint-disable-next-line no-console
      console.error(`Cannot parse msw request body : ${error}`);
    }

    // oxlint-disable-next-line no-console
    console.warn(
      `Unhandled ${request.method} request to ${request.url} \n  This request should be mocked with MSW`,
    );
  },
  quiet: true,
});

const preview: Preview = {
  decorators: [
    (Story) => {
      return (
        <I18nProvider>
          <ThemeProvider colorScheme="light">
            <FileUploadProvider>
              <ClickOutsideListenerContext.Provider
                value={{ excludedClickOutsideId: undefined }}
              >
                <Story />
              </ClickOutsideListenerContext.Provider>
            </FileUploadProvider>
          </ThemeProvider>
        </I18nProvider>
      );
    },
    RootDecorator,
  ],

  beforeEach: () => {
    resetJotaiStore();
  },

  loaders: [mswLoader],

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    mockingDate: new Date('2024-03-12T09:30:00.000Z'),
    options: {
      storySort: {
        order: ['UI', 'Modules', 'Pages'],
      },
    },
    cookie: {
      tokenPair: `{%22accessOrWorkspaceAgnosticToken%22:{%22token%22:%22${mockedUserJWT}%22%2C%22expiresAt%22:%222023-07-18T15:06:40.704Z%22%2C%22__typename%22:%22AuthToken%22}%2C%22refreshToken%22:{%22token%22:%22${mockedUserJWT}%22%2C%22expiresAt%22:%222023-10-15T15:06:41.558Z%22%2C%22__typename%22:%22AuthToken%22}%2C%22__typename%22:%22AuthTokenPair%22}`,
    },
  },
};

export default preview;
