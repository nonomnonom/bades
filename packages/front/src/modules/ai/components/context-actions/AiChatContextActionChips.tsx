import { styled } from '@linaria/react';
import { type Editor } from '@tiptap/react';
import { useLingui } from '~/utils/i18n/badesI18n';
import { LightButton } from 'ui/input';
import { themeCssVariables } from 'ui/theme-constants';

import { useGetBrowsingContext } from '@/ai/hooks/useBrowsingContext';
import { agentChatInputState } from '@/ai/states/agentChatInputState';
import { objectMetadataItemsSelector } from '@/object-metadata/states/objectMetadataItemsSelector';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

const StyledContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${themeCssVariables.spacing[1]};
  padding: 0 ${themeCssVariables.spacing[3]} ${themeCssVariables.spacing[2]};
`;

type ContextActionChip = {
  id: string;
  label: string;
  prefill: string;
};

type AiChatContextActionChipsProps = {
  editor: Editor | null;
};

export const AiChatContextActionChips = ({
  editor,
}: AiChatContextActionChipsProps) => {
  const { t: resolveMessage } = useLingui();
  const { getBrowsingContext } = useGetBrowsingContext();
  const setAgentChatInput = useSetAtomState(agentChatInputState);
  const objectMetadataItems = useAtomStateValue(objectMetadataItemsSelector);

  const browsingContext = getBrowsingContext();

  if (browsingContext === null) {
    return null;
  }

  const objectMetadata = objectMetadataItems.find(
    (item) => item.nameSingular === browsingContext.objectNameSingular,
  );
  const objectLabel =
    objectMetadata?.labelSingular ?? browsingContext.objectNameSingular;

  const chips: ContextActionChip[] =
    browsingContext.type === 'recordPage'
      ? [
          {
            id: 'summarize-record',
            label: resolveMessage(`Ringkas record ini`),
            prefill: resolveMessage(
              `Ringkas record ${objectLabel} yang sedang saya buka dan soroti informasi penting.`,
            ),
          },
          {
            id: 'related-history',
            label: resolveMessage(`Riwayat terkait`),
            prefill: resolveMessage(
              `Tampilkan riwayat atau aktivitas terkait record ${objectLabel} ini.`,
            ),
          },
          {
            id: 'create-note',
            label: resolveMessage(`Buat catatan`),
            prefill: resolveMessage(
              `Buat catatan singkat untuk record ${objectLabel} ini: `,
            ),
          },
        ]
      : [
          {
            id: 'count-view',
            label: resolveMessage(`Berapa total di view ini?`),
            prefill: resolveMessage(
              `Berapa total record ${objectMetadata?.labelPlural ?? objectLabel} di view "${browsingContext.viewName}"?`,
            ),
          },
          {
            id: 'export-summary',
            label: resolveMessage(`Export ringkasan`),
            prefill: resolveMessage(
              `Buat ringkasan data ${objectMetadata?.labelPlural ?? objectLabel} dari view "${browsingContext.viewName}" yang bisa diekspor.`,
            ),
          },
          {
            id: 'dashboard-from-view',
            label: resolveMessage(`Buat dasbor dari view ini`),
            prefill: resolveMessage(
              `Buat dasbor dari view "${browsingContext.viewName}" untuk ${objectMetadata?.labelPlural ?? objectLabel}.`,
            ),
          },
        ];

  const handleChipClick = (chip: ContextActionChip) => {
    setAgentChatInput(chip.prefill);
    editor?.commands.setContent({
      type: 'doc',
      content: [
        { type: 'paragraph', content: [{ type: 'text', text: chip.prefill }] },
      ],
    });
    editor?.commands.focus('end');
  };

  return (
    <StyledContainer>
      {chips.map((chip) => (
        <LightButton
          key={chip.id}
          title={chip.label}
          accent="secondary"
          onClick={() => handleChipClick(chip)}
        />
      ))}
    </StyledContainer>
  );
};
