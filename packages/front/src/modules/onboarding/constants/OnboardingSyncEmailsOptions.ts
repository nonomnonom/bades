import { msg } from '~/utils/i18n/badesI18n';

import { MessageChannelVisibility } from '@/accounts/types/MessageChannel';

type OnboardingEmailVisibilityProps = {
  metadata: 'active' | 'inactive';
  subject: 'active' | 'inactive';
  body: 'active' | 'inactive';
};

const { ONBOARDING_SYNC_EMAILS_OPTIONS } = {
  ONBOARDING_SYNC_EMAILS_OPTIONS: [
    {
      title: msg`Semua konten`,
      description: msg`Isi email dan acara Anda akan dibagikan dengan tim.`,
      value: MessageChannelVisibility.SHARE_EVERYTHING,
      cardMediaProps: {
        metadata: 'active',
        subject: 'active',
        body: 'active',
      } as OnboardingEmailVisibilityProps,
    },
    {
      title: msg`Subjek dan metadata`,
      description: msg`Subjek email dan judul rapat Anda akan dibagikan dengan tim.`,
      value: MessageChannelVisibility.SUBJECT,
      cardMediaProps: {
        metadata: 'active',
        subject: 'active',
        body: 'inactive',
      } as OnboardingEmailVisibilityProps,
    },
    {
      title: msg`Metadata saja`,
      description: msg`Hanya waktu dan peserta yang akan dibagikan dengan tim.`,
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
