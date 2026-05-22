import { useCurrentWidget } from '@/page-layout/widgets/hooks/useCurrentWidget';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { AppTooltip, Status } from 'ui/display';
import { WidgetType } from '~/generated-metadata/graphql';

const StyledNoDataContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;
export const PageLayoutWidgetNoDataDisplay = () => {
  const widget = useCurrentWidget();
  const tooltipId = `widget-incomplete-tooltip-${widget.id}`;

  const text = widget.type === WidgetType.IFRAME ? t`URL tidak valid` : t`Tidak ada data`;
  const tooltipContent =
    widget.type === WidgetType.IFRAME
      ? t`URL tidak valid. Klik ubah untuk mengonfigurasi widget ini.`
      : t`Tidak ada data tersedia. Klik ubah untuk mengonfigurasi widget ini.`;

  return (
    <StyledNoDataContainer>
      <div id={tooltipId}>
        <Status color="red" text={text} />
      </div>
      <AppTooltip
        anchorSelect={`#${tooltipId}`}
        content={tooltipContent}
        place="top"
      />
    </StyledNoDataContainer>
  );
};
