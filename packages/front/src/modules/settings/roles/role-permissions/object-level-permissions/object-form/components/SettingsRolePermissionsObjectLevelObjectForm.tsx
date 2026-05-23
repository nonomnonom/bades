import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useObjectMetadataItemById } from '@/object-metadata/hooks/useObjectMetadataItemById';
import { mapRLSOperandToRecordFilterOperand } from '@/object-record/record-filter/utils/mapRLSOperandToRecordFilterOperand';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsRolePermissionsObjectLevelObjectFieldPermissionTable } from '@/settings/roles/role-permissions/object-level-permissions/field-permissions/components/SettingsRolePermissionsObjectLevelObjectFieldPermissionTable';
import { SettingsRolePermissionsObjectLevelObjectFormObjectLevel } from '@/settings/roles/role-permissions/object-level-permissions/object-form/components/SettingsRolePermissionsObjectLevelObjectFormObjectLevel';
import { SettingsRolePermissionsObjectLevelRecordLevelSection } from '@/settings/roles/role-permissions/object-level-permissions/record-level-permissions/components/SettingsRolePermissionsObjectLevelRecordLevelSection';
import { settingsDraftRoleFamilyState } from '@/settings/roles/states/settingsDraftRoleFamilyState';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';
import { t } from '~/utils/i18n/badesI18n';
import { useSearchParams } from 'react-router-dom';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { SettingsPath } from 'shared/types';
import {
  getSettingsPath,
  isDefined,
  isRecordFilterValueValid,
} from 'shared/utils';
import { Button } from 'ui/input';
import { useQuery } from '@apollo/client/react';
import {
  type BillingEntitlement,
  BillingEntitlementKey,
  FindOneAgentDocument,
} from '~/generated-metadata/graphql';

type SettingsRolePermissionsObjectLevelObjectFormProps = {
  roleId: string;
  objectMetadataId: string;
};

export const SettingsRolePermissionsObjectLevelObjectForm = ({
  roleId,
  objectMetadataId,
}: SettingsRolePermissionsObjectLevelObjectFormProps) => {
  const [searchParams] = useSearchParams();
  const fromAgentId = searchParams.get('fromAgent');

  const currentWorkspace = useAtomStateValue(currentWorkspaceState);

  const settingsDraftRole = useAtomFamilyStateValue(
    settingsDraftRoleFamilyState,
    roleId,
  );

  const { data: agentData } = useQuery(FindOneAgentDocument, {
    variables: { id: fromAgentId || '' },
    skip: !fromAgentId,
  });

  const objectMetadata = useObjectMetadataItemById({
    objectId: objectMetadataId,
  });

  const workspaceBillingEntitlements = currentWorkspace?.billingEntitlements;

  const isRLSBillingEntitlementEnabled =
    workspaceBillingEntitlements?.some(
      (entitlement: BillingEntitlement) =>
        entitlement.key === BillingEntitlementKey.RLS &&
        entitlement.value === true,
    ) ?? false;

  const objectMetadataItem = objectMetadata.objectMetadataItem;

  const objectLabelSingular = objectMetadataItem.labelSingular;
  const objectLabelPlural = objectMetadataItem.labelPlural;

  const agent = agentData?.findOneAgent;

  const breadcrumbLinks =
    fromAgentId && isDefined(agent)
      ? [
          {
            children: t`Ruang Kerja`,
            href: getSettingsPath(SettingsPath.Workspace),
          },
          {
            children: ""AI",
            href: getSettingsPath(SettingsPath.AI),
          },
          {
            children: agent.label,
            href: getSettingsPath(SettingsPath.AiAgentDetail, {
              agentId: agent.id,
            }),
          },
          {
            children: t`Izin · ${objectLabelSingular}`,
          },
        ]
      : [
          {
            children: t`Ruang Kerja`,
            href: getSettingsPath(SettingsPath.Workspace),
          },
          {
            children: t`Anggota`,
            href: getSettingsPath(SettingsPath.WorkspaceMembersPage),
          },
          {
            children: t`Peran`,
            href: getSettingsPath(SettingsPath.Roles),
          },
          {
            children: settingsDraftRole.label,
            href: getSettingsPath(SettingsPath.RoleDetail, {
              roleId,
            }),
          },
          {
            children: t`Izin · ${objectLabelSingular}`,
          },
        ];

  const finishButtonPath =
    fromAgentId && isDefined(agent)
      ? getSettingsPath(SettingsPath.AiAgentDetail, { agentId: agent.id })
      : getSettingsPath(SettingsPath.RoleDetail, { roleId });

  const objectPredicates =
    settingsDraftRole.rowLevelPermissionPredicates?.filter(
      (predicate) => predicate.objectMetadataId === objectMetadataItem.id,
    ) ?? [];

  const hasInvalidPredicate = objectPredicates.some((predicate) => {
    if (isDefined(predicate.workspaceMemberFieldMetadataId)) {
      return false;
    }

    return !isRecordFilterValueValid({
      operand: mapRLSOperandToRecordFilterOperand(predicate.operand),
      value: predicate.value ?? '',
    });
  });

  const isFinishDisabled = hasInvalidPredicate;

  return (
    <SubMenuTopBarContainer
      title={t`2. Atur izin ${objectLabelPlural}`}
      links={breadcrumbLinks}
      actionButton={
        <Button
          title={t`Selesai`}
          variant="secondary"
          size="small"
          accent="blue"
          to={isFinishDisabled ? undefined : finishButtonPath}
          disabled={isFinishDisabled}
        />
      }
    >
      <SettingsPageContainer>
        <SettingsRolePermissionsObjectLevelObjectFormObjectLevel
          objectMetadataItem={objectMetadataItem}
          roleId={roleId}
        />
        <SettingsRolePermissionsObjectLevelObjectFieldPermissionTable
          objectMetadataItem={objectMetadataItem}
          roleId={roleId}
        />
        <SettingsRolePermissionsObjectLevelRecordLevelSection
          objectMetadataItem={objectMetadataItem}
          roleId={roleId}
          hasOrganizationPlan={isRLSBillingEntitlementEnabled}
        />
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
