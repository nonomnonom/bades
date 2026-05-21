import type { Bundle, ZObject } from 'zapier-platform-core';

import requestDb from 'src/utils/requestDb';

const testAuthentication = async (z: ZObject, bundle: Bundle) => {
  return await requestDb({
    z,
    bundle,
    query: 'query currentWorkspace {currentWorkspace {id displayName}}',
    endpoint: 'metadata',
  });
};

export default {
  type: 'custom',
  test: testAuthentication,
  fields: [
    {
      computed: false,
      key: 'apiKey',
      required: true,
      label: 'Api Key',
      type: 'string',
      helpText:
        'Create an API key in [your Bades workspace](https://app.bades.id/settings/apis)',
    },
    {
      computed: false,
      key: 'apiUrl',
      required: false,
      label: 'Self hosted instance url',
      type: 'string',
      placeholder: 'https://bades.custom-url.com',
      helpText: 'Set this only if you self-host Bades',
    },
  ],
  connectionLabel: '{{data.currentWorkspace.displayName}}',
  customConfig: {},
};
