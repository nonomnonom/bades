import { useLingui } from '~/utils/i18n/badesI18n';
import { ResizeHandle, useResizeHandle } from 'ui/layout';
import { TextArea } from '@/ui/input/components/TextArea';

type LogicFunctionLogsProps = {
  componentInstanceId: string;
  value: string;
};

export const LogicFunctionLogs = ({
  componentInstanceId,
  value,
}: LogicFunctionLogsProps) => {
  const { t } = useLingui();

  const {
    size: height,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd,
  } = useResizeHandle({
    initialSize: 150,
  });

  return (
    <>
      <TextArea
        textAreaId={`logs-${componentInstanceId}`}
        label={""Logs"}
        value={value}
        height={height}
        readOnly
      />
      <ResizeHandle
        onPointerDown={handleResizeStart}
        onPointerMove={handleResizeMove}
        onPointerUp={handleResizeEnd}
      />
    </>
  );
};
