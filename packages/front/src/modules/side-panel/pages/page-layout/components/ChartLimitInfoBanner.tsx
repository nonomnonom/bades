import { getChartLimitMessage } from '@/side-panel/pages/page-layout/utils/getChartLimitMessage';
import { t } from '~/utils/i18n/badesI18n';
import { SidePanelInformationBanner } from 'ui/display';
import { type WidgetConfigurationType } from '~/generated-metadata/graphql';

type ChartLimitInfoBannerProps = {
  widgetConfigurationType: WidgetConfigurationType;
  isPrimaryAxisDate: boolean;
  primaryAxisDateGranularity: Parameters<
    typeof getChartLimitMessage
  >[0]['primaryAxisDateGranularity'];
};

export const ChartLimitInfoBanner = ({
  widgetConfigurationType,
  isPrimaryAxisDate,
  primaryAxisDateGranularity,
}: ChartLimitInfoBannerProps) => {
  return (
    <SidePanelInformationBanner
      message={getChartLimitMessage({
        widgetConfigurationType,
        isPrimaryAxisDate,
        primaryAxisDateGranularity,
      })}
      tooltipMessage={
        isPrimaryAxisDate
          ? t`Pertimbangkan menambahkan filter atau mengubah granularitas tanggal untuk menampilkan lebih banyak data.`
          : t`Pertimbangkan menambahkan filter untuk menampilkan lebih banyak data.`
      }
      variant="warning"
    />
  );
};
