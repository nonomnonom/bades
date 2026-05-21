import { styled } from '@linaria/react';
import { useContext } from 'react';
import { Section } from 'ui/layout';
import { ThemeContext } from 'ui/theme-constants';
import { SettingsToolsTable } from '~/pages/settings/ai/components/SettingsToolsTable';

const StyledCoverImage = styled.div`
  background-position: center;
  background-size: cover;
  height: 160px;
  overflow: hidden;
`;

export const SettingsAgentToolsTab = () => {
  const { colorScheme } = useContext(ThemeContext);
  const coverImage =
    colorScheme === 'light'
      ? '/images/ai/ai-tools-cover-light.png'
      : '/images/ai/ai-tools-cover-dark.png';
  return (
    <>
      <Section>
        <StyledCoverImage style={{ backgroundImage: `url('${coverImage}')` }} />
      </Section>
      <SettingsToolsTable />
    </>
  );
};
