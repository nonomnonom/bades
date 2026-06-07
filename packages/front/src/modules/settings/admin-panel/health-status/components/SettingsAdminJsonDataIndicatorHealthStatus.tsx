import { SettingsAdminIndicatorHealthContext } from '@/settings/admin-panel/health-status/contexts/SettingsAdminIndicatorHealthContext';
import { styled } from '@linaria/react';
import { useContext } from 'react';
import { JsonTree } from 'ui/json-visualizer';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';
import { AdminPanelHealthServiceStatus } from '~/generated-admin/graphql';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';

const StyledDetailsContainer = styled.div`
  background-color: ${themeCssVariables.background.secondary};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.md};
  font-size: ${themeCssVariables.font.size.sm};
  overflow-x: auto;
  padding: ${themeCssVariables.spacing[4]};
`;

const StyledErrorMessage = styled.div`
  color: ${themeCssVariables.color.red};
  margin-bottom: ${themeCssVariables.spacing[4]};
  margin-top: ${themeCssVariables.spacing[2]};
`;

export const SettingsAdminJsonDataIndicatorHealthStatus = () => {
  const { copyToClipboard } = useCopyToClipboard();

  const { indicatorHealth } = useContext(SettingsAdminIndicatorHealthContext);

  const parsedDetails = indicatorHealth.details
    ? JSON.parse(indicatorHealth.details)
    : null;

  const isDown =
    !indicatorHealth.status ||
    indicatorHealth.status === AdminPanelHealthServiceStatus.OUTAGE;

  const isAnyNode = () => true;

  const serviceLabel = indicatorHealth.label;

  return (
    <Section>
      {isDown && (
        <StyledErrorMessage>
          {indicatorHealth.errorMessage ||
            `Layanan ${serviceLabel} tidak dapat dijangkau`}
        </StyledErrorMessage>
      )}
      {parsedDetails && (
        <StyledDetailsContainer>
          <JsonTree
            value={parsedDetails}
            shouldExpandNodeInitially={isAnyNode}
            emptyArrayLabel={`Array Kosong`}
            emptyObjectLabel={`Objek Kosong`}
            emptyStringLabel={`[string kosong]`}
            arrowButtonCollapsedLabel={`Perluas`}
            arrowButtonExpandedLabel={`Ciutkan`}
            onNodeValueClick={copyToClipboard}
          />
        </StyledDetailsContainer>
      )}
    </Section>
  );
};
