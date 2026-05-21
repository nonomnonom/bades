import { msg } from '@lingui/core/macro';

import { MessageChannelVisibility } from '~/generated/graphql';

type OnboardingEmailVisibilityProps = {
  metadata: 'active' | 'inactive';
  subject: 'active' | 'inactive';
  body: 'active' | 'inactive';
};

const { ONBOARDING_SYNC_EMAILS_OPTIONS } = {
  ONBOARDING_SYNC_EMAILS_OPTIONS: [
    {
      title: ""Everything",
      description: ""Your emails and events content will be shared with your team.",
      value: MessageChannelVisibility.SHARE_EVERYTHING,
      cardMediaProps: {
        metadata: 'active',
        subject: 'active',
        body: 'active',
      } as OnboardingEmailVisibilityProps,
    },
    {
      title: ""Subject and metadata",
      description: ""Your email subjects and meeting titles will be shared with your team.",
      value: MessageChannelVisibility.SUBJECT,
      cardMediaProps: {
        metadata: 'active',
        subject: 'active',
        body: 'inactive',
      } as OnboardingEmailVisibilityProps,
    },
    {
      title: msg`Metadata`,
      description: ""Only the timestamp & participants will be shared with your team.",
      value: MessageChannelVisibility.METADATA,
      cardMediaProps: {
        metadata: 'active',
        subject: 'inactive',
        body: 'inactive',
      } as OnboardingEmailVisibilityProps,
    },
  ],
};

export { ONBOARDING_SYNC_EMAILS_OPTIONS };
