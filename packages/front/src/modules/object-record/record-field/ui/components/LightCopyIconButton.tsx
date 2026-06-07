import { styled } from '@linaria/react';
import { IconCopy } from 'ui/display';
import { LightIconButton } from 'ui/input';
import { themeCssVariables } from 'ui/theme-constants';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';

const StyledButtonContainer = styled.div`
  padding: 0 ${themeCssVariables.spacing[1]};
`;

export type LightCopyIconButtonProps = {
  copyText: string;
};

export const LightCopyIconButton = ({ copyText }: LightCopyIconButtonProps) => {
  const { copyToClipboard } = useCopyToClipboard();
  return (
    <StyledButtonContainer>
      <LightIconButton
        Icon={IconCopy}
        onClick={() => {
          copyToClipboard(copyText, `Teks berhasil disalin`);
        }}
        aria-label={`Salin ke Papan Klip`}
      />
    </StyledButtonContainer>
  );
};
