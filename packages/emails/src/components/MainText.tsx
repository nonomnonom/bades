import { type ReactNode } from 'react';
import { Text } from '@react-email/components';

import { emailTheme } from 'src/common-style';

type MainTextProps = {
  children: ReactNode;
};

const mainTextStyle = {
  fontFamily: emailTheme.font.family,
  fontSize: emailTheme.font.size.md,
  fontWeight: emailTheme.font.weight.regular,
  color: emailTheme.font.colors.primary,
  lineHeight: emailTheme.font.lineHeight,
};

export const MainText = ({ children }: MainTextProps) => {
  // Cast: konflik tipe React.ReactNode antara @react-email/components vs root
  // @types/react karena Bun hoisted linker mereplikasi simbol identik di dua
  // resolution path. Cast aman karena runtime sama persis.
  return <Text style={mainTextStyle}>{children as never}</Text>;
};
