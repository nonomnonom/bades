import { useContext } from 'react';

import IconBadesStarRaw from '@assets/icons/bades-star.svg?react';
import { type IconComponentProps } from '@ui/display/icon/types/IconComponent';
import { ThemeContext } from '@ui/theme-constants';

type IconBadesStarProps = Pick<IconComponentProps, 'size' | 'stroke'>;

export const IconBadesStar = (props: IconBadesStarProps) => {
  const { theme } = useContext(ThemeContext);
  const size = props.size ?? 24;
  const stroke = props.stroke ?? theme.icon.stroke.md;

  return <IconBadesStarRaw height={size} width={size} strokeWidth={stroke} />;
};
