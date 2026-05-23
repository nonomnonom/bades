import { useContext } from 'react';

import IconBadesStarFilledRaw from '@assets/icons/bades-star-filled.svg?react';
import { type IconComponentProps } from '@ui/display/icon/types/IconComponent';
import { ThemeContext } from '@ui/theme-constants';

type IconBadesStarFilledProps = Pick<IconComponentProps, 'size' | 'stroke'>;

export const IconBadesStarFilled = (props: IconBadesStarFilledProps) => {
  const { theme } = useContext(ThemeContext);
  const size = props.size ?? 24;
  const stroke = props.stroke ?? theme.icon.stroke.md;

  return (
    <IconBadesStarFilledRaw height={size} width={size} strokeWidth={stroke} />
  );
};
