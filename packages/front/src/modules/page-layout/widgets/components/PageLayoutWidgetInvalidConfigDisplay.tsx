import { useCurrentWidget } from '@/page-layout/widgets/hooks/useCurrentWidget';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { AppTooltip, Status } from 'ui/display';

const StyledInvalidConfigContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const PageLayoutWidgetInvalidConfigDisplay = () => {
  const widget = useCurrentWidget();
  const tooltipId = `widget-invalid-config-tooltip-${widget.id}`;

  const text = t`Konfigurasi tidak valid`;
  const tooltipContent = t`Konfigurasi tidak valid. Klik ubah untuk mengonfigurasi widget ini.`;

  return (
    <StyledInvalidConfigContainer>
      <div id={tooltipId}>
        <Status color="red" text={text} />
      </div>
      <AppTooltip
        anchorSelect={`#${tooltipId}`}
        content={tooltipContent}
        place="top"
      />
    </StyledInvalidConfigContainer>
  );
};
