import { t } from '~/utils/i18n/badesI18n';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsRolesQueryEffect } from '@/settings/roles/components/SettingsRolesQueryEffect';
import { SettingsRolePermissionsObjectLevelObjectPicker } from '@/settings/roles/role-permissions/object-level-permissions/components/SettingsRolePermissionsObjectLevelObjectPicker';
import { settingsDraftRoleFamilyState } from '@/settings/roles/states/settingsDraftRoleFamilyState';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useAtomFamilyStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilyStateValue';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined } from 'shared/utils';
import { useQuery } from '@apollo/client/react';
import { FindOneAgentDocument } from '~/generated-metadata/graphql';

export const SettingsRoleAddObjectLevel = () => {
  const { roleId } = useParams();
  const [searchParams] = useSearchParams();
  const fromAgentId = searchParams.get('fromAgent');

  const settingsDraftRole = useAtomFamilyStateValue(
    settingsDraftRoleFamilyState,
    roleId ?? '',
  );

  const { data: agentData } = useQuery(FindOneAgentDocument, {
    variables: { id: fromAgentId || '' },
    skip: !fromAgentId,
  });

  const agent = agentData?.findOneAgent;

  if (!roleId) {
    return <Navigate to={getSettingsPath(SettingsPath.Roles)} />;
  }

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
            children: t`Tambah izin objek`,
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
          { children: t`Peran`, href: getSettingsPath(SettingsPath.Roles) },
          {
            children: settingsDraftRole.label ?? '',
            href: getSettingsPath(SettingsPath.RoleDetail, { roleId }),
          },
          {
            children: t`Tambah izin objek`,
            href: getSettingsPath(SettingsPath.RoleAddObjectLevel, { roleId }),
          },
        ];

  return (
    <>
      <SettingsRolesQueryEffect />
      <SubMenuTopBarContainer
        title={"1. Pilih objek"}
        links={breadcrumbLinks}
      >
        <SettingsPageContainer>
          <SettingsRolePermissionsObjectLevelObjectPicker roleId={roleId} />
        </SettingsPageContainer>
      </SubMenuTopBarContainer>
    </>
  );
};
