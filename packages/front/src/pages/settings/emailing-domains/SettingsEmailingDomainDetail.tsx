import { t, Trans } from '~/utils/i18n/badesI18n';
import { SettingsEmptyPlaceholder } from '@/settings/components/SettingsEmptyPlaceholder';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';

import { SettingsEmailingDomainVerificationRecords } from '@/settings/emailing-domains/components/SettingsEmailingDomainVerificationRecords';
import { GET_ALL_EMAILING_DOMAINS } from '@/settings/emailing-domains/graphql/queries/getAllEmailingDomains';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useQuery } from '@apollo/client/react';
import { useParams } from 'react-router-dom';
import { SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined } from 'shared/utils';
import { type GetEmailingDomainsQuery } from '~/generated-metadata/graphql';

export const SettingsEmailingDomainDetail = () => {
  const { domainId } = useParams<{ domainId: string }>();

  const { data, loading, error } = useQuery<GetEmailingDomainsQuery>(
    GET_ALL_EMAILING_DOMAINS,
    {
      skip: !domainId,
    },
  );

  const emailingDomain = data?.getEmailingDomains?.find(
    (domain) => domain.id === domainId,
  );

  if (loading) {
    return <SettingsEmptyPlaceholder>{t`Memuat...`}</SettingsEmptyPlaceholder>;
  }

  if (isDefined(error) || !isDefined(emailingDomain)) {
    return (
      <SettingsEmptyPlaceholder>
        <Trans>Domain tidak ditemukan</Trans>
      </SettingsEmptyPlaceholder>
    );
  }

  return (
    <SubMenuTopBarContainer
      title={emailingDomain.domain}
      links={[
        {
          children: <Trans>Ruang kerja</Trans>,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        {
          children: <Trans>Domain surel</Trans>,
          href: getSettingsPath(SettingsPath.Applications),
        },
        { children: emailingDomain.domain },
      ]}
    >
      <SettingsPageContainer>
        {emailingDomain.verificationRecords &&
          emailingDomain.verificationRecords.length > 0 && (
            <SettingsEmailingDomainVerificationRecords
              domain={emailingDomain}
            />
          )}
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
