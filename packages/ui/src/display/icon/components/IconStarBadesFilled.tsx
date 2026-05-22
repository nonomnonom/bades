import { useContext } from 'react';

import IconStarBadesFilledRaw from '@assets/icons/bades-star-filled.svg?react';
import { type IconComponentProps } from '@ui/display/icon/types/IconComponent';
import { ThemeContext } from '@ui/theme-constants';

type IconStarBadesFilledProps = Pick<IconComponentProps, 'size' | 'stroke'>;

export const IconStarBadesFilled = (props: IconStarBadesFilledProps) => {
  const { theme } = useContext(ThemeContext);
  const size = props.size ?? 24;
  const stroke = props.stroke ?? theme.icon.stroke.md;

  return (
    <IconStarBadesFilledRaw height={size} width={size} strokeWidth={stroke} />
  );
};
