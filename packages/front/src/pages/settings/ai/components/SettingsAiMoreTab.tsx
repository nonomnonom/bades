import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { FormAdvancedTextFieldInput } from '@/object-record/record-field/ui/form-types/components/FormAdvancedTextFieldInput';
import { SettingsCard } from '@/settings/components/SettingsCard';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { CombinedGraphQLErrors } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { styled } from '@linaria/react';
import { t } from '@lingui/core/macro';
import { useContext, useState } from 'react';
import { SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined } from 'shared/utils';
import { H2Title, IconPrompt } from 'ui/display';
import { Section } from 'ui/layout';
import { UndecoratedLink } from 'ui/navigation';
import { ThemeContext, themeCssVariables } from 'ui/theme-constants';
import { useDebouncedCallback } from 'use-debounce';
import {
  GetAiSystemPromptPreviewDocument,
  UpdateWorkspaceDocument,
} from '~/generated-metadata/graphql';
import { SettingsAiMCP } from '~/pages/settings/ai/components/SettingsAiMCP';
import { formatNumber } from '~/utils/format/formatNumber';

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
`;

export const SettingsAiMoreTab = () => {
  const { theme } = useContext(ThemeContext);
  const { enqueueErrorSnackBar } = useSnackBar();
  const [currentWorkspace, setCurrentWorkspace] = useAtomState(
    currentWorkspaceState,
  );
  const [updateWorkspace] = useMutation(UpdateWorkspaceDocument);
  const { data: previewData } = useQuery(GetAiSystemPromptPreviewDocument);

  const initialInstructions = currentWorkspace?.aiAdditionalInstructions ?? '';
  const [workspaceInstructions, setWorkspaceInstructions] =
    useState(initialInstructions);
  const [originalInstructions, setOriginalInstructions] =
    useState(initialInstructions);

  const autoSave = useDebouncedCallback(async (newValue: string) => {
    if (!currentWorkspace?.id || newValue === originalInstructions) {
      return;
    }

    try {
      setCurrentWorkspace({
        ...currentWorkspace,
        aiAdditionalInstructions: newValue || null,
      });

      await updateWorkspace({
        variables: {
          input: {
            aiAdditionalInstructions: newValue || null,
          },
        },
      });

      setOriginalInstructions(newValue);
    } catch (error) {
      setCurrentWorkspace({
        ...currentWorkspace,
        aiAdditionalInstructions: originalInstructions || null,
      });

      if (CombinedGraphQLErrors.is(error)) {
        enqueueErrorSnackBar({
          apolloError: error,
        });
      } else {
        enqueueErrorSnackBar({
          message: t`Gagal menyimpan instruksi ruang kerja`,
        });
      }
    }
  }, 1000);

  const handleWorkspaceInstructionsChange = (value: string) => {
    setWorkspaceInstructions(value);
    autoSave(value);
  };

  const systemPromptTokenCount =
    previewData?.getAiSystemPromptPreview.estimatedTokenCount;
  const systemPromptDescription = isDefined(systemPromptTokenCount)
    ? t`Baca prompt sistem untuk memahami cara kerja AI (~${formatNumber(
        systemPromptTokenCount,
        {
          abbreviate: true,
          decimals: 1,
        },
      )} token)`
    : t`Baca prompt sistem untuk memahami cara kerja AI`;

  return (
    <>
      <Section>
        <H2Title
          title={t`Instruksi Ruang Kerja`}
          description={t`Tambahkan instruksi khusus untuk ruang kerja Anda (disisipkan ke prompt sistem)`}
        />
        <StyledFormContainer>
          <FormAdvancedTextFieldInput
            key={originalInstructions}
            readonly={false}
            defaultValue={workspaceInstructions}
            contentType="markdown"
            onChange={handleWorkspaceInstructionsChange}
            enableFullScreen={true}
            fullScreenBreadcrumbs={[
              {
                children: t`Prompt Sistem`,
                href: '#',
              },
              {
                children: t`Instruksi Ruang Kerja`,
              },
            ]}
            placeholder={t`Mis., "Kami adalah pemerintah desa. Selalu gunakan bahasa formal..."`}
            minHeight={150}
            maxWidth={700}
          />
        </StyledFormContainer>
      </Section>
      <SettingsAiMCP />

      <Section>
        <H2Title
          title={t`Prompt Sistem`}
          description={systemPromptDescription}
        />

        <UndecoratedLink to={getSettingsPath(SettingsPath.AiPrompts)}>
          <SettingsCard
            Icon={<IconPrompt size={theme.icon.size.md} />}
            title={t`Baca prompt sistem`}
          />
        </UndecoratedLink>
      </Section>
    </>
  );
};
