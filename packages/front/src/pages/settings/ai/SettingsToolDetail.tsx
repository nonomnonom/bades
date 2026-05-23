import { t } from '~/utils/i18n/badesI18n';
import { useQuery } from '@apollo/client/react';
import { useContext, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';

import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useGetOneLogicFunction } from '@/logic-functions/hooks/useGetOneLogicFunction';
import { usePersistLogicFunction } from '@/logic-functions/hooks/usePersistLogicFunction';

import { SettingsPageContainer } from '@/settings/components/SettingsPageContainer';
import { SettingsLogicFunctionLabelContainer } from '@/settings/logic-functions/components/SettingsLogicFunctionLabelContainer';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { TextArea } from '@/ui/input/components/TextArea';
import { ConfirmationModal } from '@/ui/layout/modal/components/ConfirmationModal';
import { useModal } from '@/ui/layout/modal/hooks/useModal';
import { SubMenuTopBarContainer } from '@/ui/layout/page/components/SubMenuTopBarContainer';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined, isValidUuid } from 'shared/utils';
import { H2Title, IconTrash } from 'ui/display';
import { Button } from 'ui/input';
import { Section } from 'ui/layout';

import { ThemeContext } from 'ui/theme-constants';
import { useDebouncedCallback } from 'use-debounce';
import {
  GetToolIndexDocument,
  GetToolInputSchemaDocument,
} from '~/generated-metadata/graphql';
import { SettingsToolParameterTable } from '~/pages/settings/ai/components/SettingsToolParameterTable';

const DELETE_TOOL_MODAL_ID = 'delete-tool-modal';

export const SettingsToolDetail = () => {
  const { toolIdentifier } = useParams();
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const { updateLogicFunction, deleteLogicFunction } =
    usePersistLogicFunction();
  const { openModal } = useModal();
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedName, setEditedName] = useState<string | null>(null);
  const [editedDescription, setEditedDescription] = useState<string | null>(
    null,
  );

  const isCustomTool = isDefined(toolIdentifier) && isValidUuid(toolIdentifier);

  const { logicFunction, loading: logicFunctionLoading } =
    useGetOneLogicFunction({
      id: toolIdentifier ?? '',
      skip: !isCustomTool,
    });

  const { data: toolIndexData, loading: toolIndexLoading } = useQuery(
    GetToolIndexDocument,
    { skip: isCustomTool },
  );

  const systemTool = toolIndexData?.getToolIndex.find(
    (entry) => entry.name === toolIdentifier,
  );

  const { data: schemaData, loading: schemaLoading } = useQuery(
    GetToolInputSchemaDocument,
    {
      variables: { toolName: toolIdentifier ?? '' },
      skip: isCustomTool || !isDefined(systemTool),
    },
  );

  const loading = isCustomTool
    ? logicFunctionLoading
    : toolIndexLoading || schemaLoading;

  const workspaceCustomApplicationId =
    currentWorkspace?.workspaceCustomApplication?.id;

  const isManaged =
    isCustomTool &&
    isDefined(logicFunction?.applicationId) &&
    logicFunction.applicationId !== workspaceCustomApplicationId;

  const isReadOnly = !isCustomTool || isManaged;

  const name = isCustomTool ? logicFunction?.name : toolIdentifier;
  const description = isCustomTool
    ? logicFunction?.description
    : systemTool?.description;

  const inputSchema = isCustomTool
    ? logicFunction?.toolTriggerSettings?.inputSchema
    : schemaData?.getToolInputSchema;

  const functionLink = isCustomTool
    ? isDefined(logicFunction?.applicationId)
      ? getSettingsPath(SettingsPath.ApplicationLogicFunctionDetail, {
          applicationId: logicFunction.applicationId,
          logicFunctionId: logicFunction?.id ?? '',
        })
      : getSettingsPath(SettingsPath.LogicFunctionDetail, {
          logicFunctionId: logicFunction?.id ?? '',
        })
    : undefined;

  const debouncedSaveName = useDebouncedCallback(async (value: string) => {
    if (!isCustomTool || !isDefined(logicFunction)) return;

    const result = await updateLogicFunction({
      input: {
        id: logicFunction.id,
        update: { name: value },
      },
    });

    if (result.status === 'failed') {
      setEditedName(logicFunction.name);
    }
  }, 1_000);

  const handleNameChange = (value: string) => {
    setEditedName(value);
    debouncedSaveName(value);
  };

  const debouncedSaveDescription = useDebouncedCallback(
    async (value: string) => {
      if (!isCustomTool || !isDefined(logicFunction)) return;

      const result = await updateLogicFunction({
        input: {
          id: logicFunction.id,
          update: { description: value },
        },
      });

      if (result.status === 'failed') {
        setEditedDescription(logicFunction.description ?? null);
      }
    },
    1_000,
  );

  const handleDescriptionChange = (value: string) => {
    setEditedDescription(value);
    debouncedSaveDescription(value);
  };

  const handleDelete = async () => {
    if (!isCustomTool || !isDefined(logicFunction)) return;

    setIsDeleting(true);

    const result = await deleteLogicFunction({
      input: { id: logicFunction.id },
    });

    if (result.status === 'successful') {
      enqueueSuccessSnackBar({ message: t`Alat berhasil dihapus` });
      navigate(getSettingsPath(SettingsPath.AI, undefined, undefined, 'tools'));
    } else {
      enqueueErrorSnackBar({ message: t`Gagal menghapus alat` });
    }

    setIsDeleting(false);
  };

  return (
    <SubMenuTopBarContainer
      title={
        isCustomTool ? (
          <SettingsLogicFunctionLabelContainer
            value={editedName ?? name ?? ''}
            onChange={handleNameChange}
          />
        ) : (
          (name ?? '')
        )
      }
      links={[
        {
          children: t`Ruang Kerja`,
          href: getSettingsPath(SettingsPath.Workspace),
        },
        {
          children: "AI",
          href: getSettingsPath(SettingsPath.AI, undefined, undefined, 'tools'),
        },
        { children: editedName ?? name ?? '' },
      ]}
    >
      <SettingsPageContainer>
        {loading ? (
          <SkeletonTheme
            baseColor={theme.background.tertiary}
            highlightColor={theme.background.transparent.lighter}
            borderRadius={4}
          >
            <Section>
              <Skeleton height={20} width={200} />
              <Skeleton height={20} width={400} />

              <Skeleton height={80} />
            </Section>
          </SkeletonTheme>
        ) : (
          <>
            <Section>
              <H2Title
                title={t`Parameter`}
                description={t`Parameter input yang diterima oleh alat ini`}
              />
              <SettingsToolParameterTable
                schemaProperties={inputSchema?.properties ?? {}}
                requiredFields={inputSchema?.required}
                functionLink={functionLink}
              />
            </Section>

            <Section>
              <H2Title
                title={t`Deskripsi`}
                description={t`Tentukan apa yang dilakukan alat ini`}
              />
              <TextArea
                textAreaId="tool-description-textarea"
                placeholder={t`Tulis deskripsi`}
                minRows={3}
                value={editedDescription ?? description ?? ''}
                onChange={handleDescriptionChange}
                disabled={isReadOnly}
              />
            </Section>

            {isCustomTool && !isManaged && (
              <Section>
                <H2Title
                  title={t`Zona berbahaya`}
                  description={t`Hapus alat ini`}
                />
                <Button
                  Icon={IconTrash}
                  title={t`Hapus`}
                  accent="danger"
                  size="small"
                  variant="secondary"
                  onClick={() => openModal(DELETE_TOOL_MODAL_ID)}
                />
              </Section>
            )}
          </>
        )}
      </SettingsPageContainer>
      <ConfirmationModal
        modalInstanceId={DELETE_TOOL_MODAL_ID}
        title={t`Hapus Alat`}
        subtitle={t`Yakin ingin menghapus alat ini? Tindakan ini tidak dapat dibatalkan.`}
        onConfirmClick={handleDelete}
        confirmButtonText={t`Hapus`}
        loading={isDeleting}
      />
    </SubMenuTopBarContainer>
  );
};
