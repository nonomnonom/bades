import { useContext } from 'react';

import IconStarBadesRaw from '@assets/icons/bades-star.svg?react';
import { type IconComponentProps } from '@ui/display/icon/types/IconComponent';
import { ThemeContext } from '@ui/theme-constants';

type IconStarBadesProps = Pick<IconComponentProps, 'size' | 'stroke'>;

export const IconStarBades = (props: IconStarBadesProps) => {
  const { theme } = useContext(ThemeContext);
  const size = props.size ?? 24;
  const stroke = props.stroke ?? theme.icon.stroke.md;

  return <IconStarBadesRaw height={size} width={size} strokeWidth={stroke} />;
};
