/* @license Enterprise */

import { styled } from '@linaria/react';
import { t } from '~/utils/i18n/badesI18n';
import { H2Title, IconArrowUp, IconLock } from 'ui/display';
import { Card, Section } from 'ui/layout';

import { billingState } from '@/client-config/states/billingState';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { SettingsOptionCardContentButton } from '@/settings/components/SettingsOptions/SettingsOptionCardContentButton';
import { SettingsRolePermissionsObjectLevelRecordLevelPermissionFilterBuilder } from '@/settings/roles/role-permissions/object-level-permissions/record-level-permissions/components/SettingsRolePermissionsObjectLevelRecordLevelPermissionFilterBuilder';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { SettingsPath } from 'shared/types';
import { Button } from 'ui/input';
import { themeCssVariables } from 'ui/theme-constants';
import { useNavigateSettings } from '~/hooks/useNavigateSettings';
import { OrganizationAdornment } from '~/pages/settings/enterprise/components/OrganizationAdornment';

const StyledContent = styled.div`
  padding-bottom: ${themeCssVariables.spacing[2]};
`;

const StyledCardContainer = styled.div`
  margin-top: ${themeCssVariables.spacing[4]};
  overflow: hidden;
`;

type SettingsRolePermissionsObjectLevelRecordLevelSectionProps = {
  objectMetadataItem: EnrichedObjectMetadataItem;
  roleId: string;
  hasOrganizationPlan: boolean;
};

export const SettingsRolePermissionsObjectLevelRecordLevelSection = ({
  objectMetadataItem,
  roleId,
  hasOrganizationPlan,
}: SettingsRolePermissionsObjectLevelRecordLevelSectionProps) => {
  const navigateSettings = useNavigateSettings();
  const billing = useAtomStateValue(billingState);
  const isBillingEnabled = billing?.isBillingEnabled ?? false;

  if (!hasOrganizationPlan) {
    return (
      <Section>
        <H2Title
          title={t`Tingkat Data`}
          description={t`Kemampuan memfilter data yang dapat diakses pengguna`}
          adornment={<OrganizationAdornment />}
        />
        <StyledCardContainer>
          <Card rounded>
            <SettingsOptionCardContentButton
              Icon={IconLock}
              title={t`Tingkatkan untuk mengakses`}
              description={t`Fitur ini tersedia di Paket Enterprise`}
              Button={
                <Button
                  title={t`Tingkatkan`}
                  variant="primary"
                  accent="blue"
                  size="small"
                  Icon={IconArrowUp}
                  onClick={() =>
                    navigateSettings(
                      isBillingEnabled
                        ? SettingsPath.Billing
                        : SettingsPath.AdminPanelEnterprise,
                    )
                  }
                />
              }
            />
          </Card>
        </StyledCardContainer>
      </Section>
    );
  }

  return (
    <Section>
      <H2Title
        title={t`Tingkat Data`}
        description={t`Kemampuan memfilter data yang dapat diakses pengguna.`}
      />
      <StyledContent>
        <SettingsRolePermissionsObjectLevelRecordLevelPermissionFilterBuilder
          roleId={roleId}
          objectMetadataItem={objectMetadataItem}
        />
      </StyledContent>
    </Section>
  );
};
