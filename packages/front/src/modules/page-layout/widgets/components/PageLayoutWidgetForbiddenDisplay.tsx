import { ForbiddenFieldDisplay } from '@/object-record/record-field/ui/meta-types/display/components/ForbiddenFieldDisplay';
import { type WidgetAccessDenialInfo } from '@/page-layout/widgets/types/WidgetAccessDenialInfo';
import { plural, t } from '@lingui/core/macro';
import { isDefined } from 'shared/utils';
import { AppTooltip } from 'ui/display';

type PageLayoutWidgetForbiddenDisplayProps = {
  widgetId: string;
  restriction: WidgetAccessDenialInfo;
};

export const PageLayoutWidgetForbiddenDisplay = ({
  widgetId,
  restriction,
}: PageLayoutWidgetForbiddenDisplayProps) => {
  const tooltipId = `widget-forbidden-tooltip-${widgetId}`;

  const getTooltipContent = () => {
    if (restriction.type === 'object' && isDefined(restriction.objectName)) {
      const objectName = restriction.objectName;
      return t`Anda tidak memiliki izin untuk mengakses objek ${objectName}`;
    }

    if (
      restriction.type === 'field' &&
      isDefined(restriction.fieldNames) &&
      restriction.fieldNames.length > 0
    ) {
      const fieldsList = restriction.fieldNames.join(', ');
      return plural(restriction.fieldNames.length, {
        one: `Anda tidak memiliki izin untuk mengakses kolom ${fieldsList}`,
        other: `Anda tidak memiliki izin untuk mengakses kolom-kolom ${fieldsList}`,
      });
    }

    return t`Anda tidak memiliki izin untuk melihat widget ini`;
  };

  return (
    <>
      <div id={tooltipId}>
        <ForbiddenFieldDisplay />
      </div>
      <AppTooltip
        anchorSelect={`#${tooltipId}`}
        content={getTooltipContent()}
        place="top"
      />
    </>
  );
};
