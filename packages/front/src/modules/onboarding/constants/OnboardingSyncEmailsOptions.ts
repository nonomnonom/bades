import { MessageChannelVisibility } from '@/accounts/types/MessageChannel';

type OnboardingEmailVisibilityProps = {
  metadata: 'active' | 'inactive';
  subject: 'active' | 'inactive';
  body: 'active' | 'inactive';
};

const { ONBOARDING_SYNC_EMAILS_OPTIONS } = {
  ONBOARDING_SYNC_EMAILS_OPTIONS: [
    {
      title: `Semua konten`,
      description: `Isi email dan acara Anda akan dibagikan dengan tim.`,
      value: MessageChannelVisibility.SHARE_EVERYTHING,
      cardMediaProps: {
        metadata: 'active',
        subject: 'active',
        body: 'active',
      } as OnboardingEmailVisibilityProps,
    },
    {
      title: `Subjek dan metadata`,
      description: `Subjek email dan judul rapat Anda akan dibagikan dengan tim.`,
      value: MessageChannelVisibility.SUBJECT,
      cardMediaProps: {
        metadata: 'active',
        subject: 'active',
        body: 'inactive',
      } as OnboardingEmailVisibilityProps,
    },
    {
      title: `Metadata saja`,
      description: `Hanya waktu dan peserta yang akan dibagikan dengan tim.`,
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
