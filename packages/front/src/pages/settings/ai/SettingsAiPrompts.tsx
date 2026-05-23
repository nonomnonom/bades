import { t } from '~/utils/i18n/badesI18n';
import { styled } from '@linaria/react';

import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { FormAdvancedTextFieldInput } from '@/object-record/record-field/ui/form-types/components/FormAdvancedTextFieldInput';
import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useQuery } from '@apollo/client/react';
import { SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined } from 'shared/utils';
import { H2Title, H3Title } from 'ui/display';
import { Section } from 'ui/layout';
import { themeCssVariables } from 'ui/theme-constants';
import { GetAiSystemPromptPreviewDocument } from '~/generated-metadata/graphql';
import { formatNumber } from '~/utils/format/formatNumber';

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[4]};
`;

const StyledTitleContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[4]};
  margin-top: ${themeCssVariables.spacing[2]};
`;

export const SettingsAiPrompts = () => {
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);

  const { data: previewData, loading: previewLoading } = useQuery(
    GetAiSystemPromptPreviewDocument,
  );

  const preview = previewData?.getAiSystemPromptPreview;
  const sections = preview?.sections ?? [];

  const buildUserContextPreview = (): string => {
    if (!isDefined(currentWorkspaceMember)) {
      return '';
    }

    const parts = [
      `**${t`Pengguna`}:** ${currentWorkspaceMember.name.firstName} ${currentWorkspaceMember.name.lastName}`.trim(),
      `**${t`Lokal`}:** ${currentWorkspaceMember.locale ?? 'id'}`,
    ];

    if (isDefined(currentWorkspaceMember.timeZone)) {
      parts.push(`**${t`Zona Waktu`}:** ${currentWorkspaceMember.timeZone}`);
    }

    return parts.join('\n\n');
  };

  const userContextPreview = buildUserContextPreview();

  const promptSections = sections.filter(
    (section) =>
      section.title !== 'Workspace Instructions' &&
      section.title !== 'User Context',
  );

  const totalTokenCount = isDefined(preview)
    ? t`~ ${formatNumber(preview.estimatedTokenCount, {
        abbreviate: true,
        decimals: 1,
      })} tokens`
    : '';

  return (
    <SubMenuTopBarContainer
      links={[
        {
          children: t`Ruang Kerja`,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        { children: t`AI`, href: getSettingsPath(SettingsPath.AI) },
        { children: t`Prompt Sistem` },
      ]}
    >
      <SettingsPageContainer>
        <Section>
          <StyledTitleContainer>
            <H3Title
              title={t`Prompt Sistem`}
              description={[t`Hanya baca`, totalTokenCount]
                .filter(Boolean)
                .join(' ')}
            />
          </StyledTitleContainer>
        </Section>
        {promptSections.map((section) => {
          const sectionTokenCount = t`~ ${formatNumber(
            section.estimatedTokenCount,
            {
              abbreviate: true,
              decimals: 1,
            },
          )} tokens`;

          return (
            <Section key={section.title}>
              <H2Title
                title={section.title}
                description={[t`Hanya baca`, sectionTokenCount]
                  .filter(Boolean)
                  .join(' ')}
              />
              <StyledFormContainer>
                <FormAdvancedTextFieldInput
                  key={
                    previewLoading ? `loading-${section.title}` : section.title
                  }
                  label={section.title}
                  readonly={true}
                  defaultValue={section.content}
                  contentType="markdown"
                  onChange={() => {}}
                  enableFullScreen={true}
                  fullScreenBreadcrumbs={[
                    {
                      children: t`Prompt Sistem`,
                      href: '#',
                    },
                    {
                      children: section.title,
                    },
                  ]}
                  minHeight={120}
                  maxWidth={700}
                />
              </StyledFormContainer>
            </Section>
          );
        })}

        <Section>
          <H2Title
            title={t`Konteks Pengguna`}
            description={t`Informasi tentang pengguna saat ini (dibuat otomatis dan disertakan pada setiap permintaan)`}
          />
          <StyledFormContainer>
            <FormAdvancedTextFieldInput
              label={t`Informasi Pengguna`}
              readonly={true}
              defaultValue={userContextPreview}
              contentType="markdown"
              onChange={() => {}}
              enableFullScreen={false}
              minHeight={80}
              maxWidth={700}
            />
          </StyledFormContainer>
        </Section>
      </SettingsPageContainer>
    </SubMenuTopBarContainer>
  );
};
