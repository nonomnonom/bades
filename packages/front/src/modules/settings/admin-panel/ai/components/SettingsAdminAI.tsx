import { useState } from 'react';

import { useQuery } from '@apollo/client/react';
import { SettingsPath } from 'shared/types';
import { getSettingsPath } from 'shared/utils';
import { Tag } from 'ui/components';
import { H2Title, IconLock, IconSparkles } from 'ui/display';
import { Card, Section } from 'ui/layout';
import { styled } from '@linaria/react';
import { themeCssVariables } from 'ui/theme-constants';

import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { billingState } from '@/client-config/states/billingState';
import { useApolloAdminClient } from '@/settings/admin-panel/apollo/hooks/useApolloAdminClient';
import { GET_ADMIN_AI_MODELS } from '@/settings/admin-panel/ai/graphql/queries/getAdminAiModels';
import { GET_ADMIN_AI_USAGE_BY_WORKSPACE } from '@/settings/admin-panel/ai/graphql/queries/getAdminAiUsageByWorkspace';
import { SettingsSectionSkeletonLoader } from '@/settings/components/SettingsSectionSkeletonLoader';
import { SettingsEnterpriseFeatureGateCard } from '@/settings/components/SettingsEnterpriseFeatureGateCard';
import { useUsageValueFormatter } from '@/settings/usage/hooks/useUsageValueFormatter';
import { getPeriodDates } from '@/settings/usage/utils/getPeriodDates';
import { getPeriodOptions } from '@/settings/usage/utils/getPeriodOptions';
import { type PeriodPreset } from '@/settings/usage/utils/periodPreset';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { Select } from '@/ui/input/components/Select';
import { Table } from '@/ui/layout/table/components/Table';
import { TableCell } from '@/ui/layout/table/components/TableCell';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import { type AdminAiModelConfig } from '~/generated-admin/graphql';

const USAGE_TABLE_GRID_TEMPLATE_COLUMNS = '1fr 120px';

type UsageBreakdownItem = {
  key: string;
  label?: string | null;
  creditsUsed: number;
};

const StyledSingleModelCard = styled(Card)`
  align-items: center;
  display: flex;
  flex-direction: row;
  gap: ${themeCssVariables.spacing[4]};
  padding: ${themeCssVariables.spacing[5]};
`;

const StyledModelInfoBlock = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[1]};
`;

const StyledModelLabel = styled.div`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  font-weight: ${themeCssVariables.font.weight.semiBold};
`;

const StyledModelMeta = styled.div`
  color: ${themeCssVariables.font.color.tertiary};
  font-size: ${themeCssVariables.font.size.sm};
`;

const StyledStatusBadge = styled.span<{ isAvailable: boolean }>`
  align-items: center;
  border-radius: 999px;
  display: inline-flex;
  font-size: ${themeCssVariables.font.size.xs};
  font-weight: ${themeCssVariables.font.weight.medium};
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
  background-color: ${({ isAvailable }) =>
    isAvailable
      ? themeCssVariables.color.green10
      : themeCssVariables.color.red10};
  color: ${({ isAvailable }) =>
    isAvailable ? themeCssVariables.color.green : themeCssVariables.color.red};
`;

export const SettingsAdminAI = () => {
  const apolloAdminClient = useApolloAdminClient();
  const { formatUsageValue } = useUsageValueFormatter();
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const billing = useAtomStateValue(billingState);
  const isBillingEnabled = billing?.isBillingEnabled ?? false;
  const hasEnterpriseAccess =
    isBillingEnabled ||
    currentWorkspace?.hasValidEnterpriseValidityToken === true;
  const [usagePeriod, setUsagePeriod] = useState<PeriodPreset>('30d');
  const periodOptions = getPeriodOptions();
  const usageDates = getPeriodDates(usagePeriod);

  const { data, loading: isLoadingModels } = useQuery<{
    getAdminAiModels: {
      defaultSmartModelId?: string | null;
      defaultFastModelId?: string | null;
      models: AdminAiModelConfig[];
    };
  }>(GET_ADMIN_AI_MODELS, { client: apolloAdminClient });

  const { data: usageData, previousData: previousUsageData } = useQuery<{
    getAdminAiUsageByWorkspace: UsageBreakdownItem[];
  }>(GET_ADMIN_AI_USAGE_BY_WORKSPACE, {
    client: apolloAdminClient,
    variables: {
      periodStart: usageDates.periodStart,
      periodEnd: usageDates.periodEnd,
    },
    skip: !hasEnterpriseAccess,
  });

  const effectiveUsageData = usageData ?? previousUsageData;
  const usageByWorkspace = effectiveUsageData?.getAdminAiUsageByWorkspace ?? [];

  const models = data?.getAdminAiModels?.models ?? [];
  const singleModel = models[0];

  if (isLoadingModels) {
    return <SettingsSectionSkeletonLoader />;
  }

  return (
    <>
      <Section>
        <H2Title
          title="Model Operasional"
          description="Bades AI berjalan dengan satu model. Konfigurasi dilakukan melalui env OPENROUTER_API_KEY."
        />

        <StyledSingleModelCard rounded>
          <IconSparkles size={32} />
          <StyledModelInfoBlock>
            <StyledModelLabel>
              {singleModel?.label ?? 'Tencent Hy3 Preview'}
            </StyledModelLabel>
            <StyledModelMeta>
              {singleModel?.modelId ?? 'openrouter/tencent/hy3-preview'} ·
              konteks 256K · max output 32K
            </StyledModelMeta>
          </StyledModelInfoBlock>
          {singleModel && (
            <StyledStatusBadge isAvailable={singleModel.isAvailable}>
              {singleModel.isAvailable
                ? singleModel.isAdminEnabled
                  ? 'Aktif'
                  : 'Dinonaktifkan'
                : 'Tidak tersedia'}
            </StyledStatusBadge>
          )}
        </StyledSingleModelCard>
      </Section>

      <Section>
        <H2Title
          title={`Penggunaan AI per Ruang Kerja`}
          description={`Konsumsi AI di semua ruang kerja.`}
          adornment={
            hasEnterpriseAccess ? (
              <Select
                dropdownId="admin-ai-usage-period"
                value={usagePeriod}
                options={periodOptions}
                onChange={setUsagePeriod}
                needIconCheck
                selectSizeVariant="small"
              />
            ) : (
              <Tag
                text={`Perusahaan`}
                color="transparent"
                Icon={IconLock}
                variant="border"
              />
            )
          }
        />
        {hasEnterpriseAccess ? (
          usageByWorkspace.length > 0 ? (
            <Table>
              <TableRow gridTemplateColumns={USAGE_TABLE_GRID_TEMPLATE_COLUMNS}>
                <TableHeader>Ruang Kerja</TableHeader>
                <TableHeader align="right">Penggunaan</TableHeader>
              </TableRow>
              {usageByWorkspace.map((item) => (
                <TableRow
                  key={item.key}
                  gridTemplateColumns={USAGE_TABLE_GRID_TEMPLATE_COLUMNS}
                  to={getSettingsPath(SettingsPath.AdminPanelWorkspaceDetail, {
                    workspaceId: item.key,
                  })}
                >
                  <TableCell color={themeCssVariables.font.color.primary}>
                    {item.label ?? item.key}
                  </TableCell>
                  <TableCell align="right">
                    {formatUsageValue(item.creditsUsed)}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          ) : (
            <Card rounded>
              <TableRow gridTemplateColumns="1fr">
                <TableCell
                  color={themeCssVariables.font.color.tertiary}
                  align="center"
                >
                  {`Belum ada data penggunaan AI.`}
                </TableCell>
              </TableRow>
            </Card>
          )
        ) : (
          <SettingsEnterpriseFeatureGateCard
            title={`Fitur Enterprise`}
            description={`Analitik penggunaan AI di semua ruang kerja tersedia dengan kunci Enterprise.`}
            buttonTitle={`Aktifkan`}
          />
        )}
      </Section>
    </>
  );
};
