import { t } from '~/utils/i18n/badesI18n';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { Table } from '@/ui/layout/table/components/Table';
import { TableCell } from '@/ui/layout/table/components/TableCell';
import { TableHeader } from '@/ui/layout/table/components/TableHeader';
import { TableRow } from '@/ui/layout/table/components/TableRow';
import { styled } from '@linaria/react';
import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { SettingsPath } from 'shared/types';
import { getSettingsPath, isDefined } from 'shared/utils';
import { IconChevronRight, Status } from 'ui/display';
import { Button, LightIconButton } from 'ui/input';
import {
  AnimatedPlaceholder,
  AnimatedPlaceholderEmptyContainer,
  AnimatedPlaceholderEmptySubTitle,
  AnimatedPlaceholderEmptyTextContainer,
  AnimatedPlaceholderEmptyTitle,
} from 'ui/layout';
import { UndecoratedLink } from 'ui/navigation';
import { themeCssVariables } from 'ui/theme-constants';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  EvaluateAgentTurnDocument,
  GetAgentTurnsDocument,
} from '~/generated-metadata/graphql';

const StyledTableContainer = styled.div`
  margin-top: ${themeCssVariables.spacing[3]};
`;

const StyledTableHeaderRowContainer = styled.div`
  margin-bottom: ${themeCssVariables.spacing[2]};
`;

type SettingsAgentLogsTabProps = {
  agentId: string;
};

export const SettingsAgentLogsTab = ({
  agentId,
}: SettingsAgentLogsTabProps) => {
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const [evaluatingTurnIds, setEvaluatingTurnIds] = useState<Set<string>>(
    new Set(),
  );

  const getLatestEvaluation = (evaluations: any[]) => {
    if (evaluations.length === 0) return null;
    return [...evaluations].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];
  };

  const computeBackgroundEvaluatingTurnIds = (turnsData: any[]) => {
    const now = Date.now();
    const RECENT_TURN_THRESHOLD = 5 * 60 * 1000;
    const backgroundEvaluatingTurnIds = new Set<string>();

    turnsData.forEach((turn: any) => {
      const latestEvaluation = getLatestEvaluation(turn.evaluations);
      const turnAge = now - new Date(turn.createdAt).getTime();

      if (!isDefined(latestEvaluation) && turnAge < RECENT_TURN_THRESHOLD) {
        backgroundEvaluatingTurnIds.add(turn.id);
      }
    });

    return backgroundEvaluatingTurnIds;
  };

  const { data, loading, refetch, startPolling, stopPolling } = useQuery(
    GetAgentTurnsDocument,
    {
      variables: { agentId },
      skip: !agentId,
    },
  );

  useEffect(() => {
    if (data) {
      const backgroundIds = computeBackgroundEvaluatingTurnIds(
        data?.agentTurns ?? [],
      );
      if (backgroundIds.size > 0) {
        startPolling(3000);
      } else {
        stopPolling();
      }
    }
  }, [data, startPolling, stopPolling]);

  const turns = data?.agentTurns || [];
  const backgroundEvaluatingTurnIds = computeBackgroundEvaluatingTurnIds(turns);

  const [evaluateTurn, { loading: evaluating }] = useMutation(
    EvaluateAgentTurnDocument,
    {
      onCompleted: (data) => {
        const turnId = data?.evaluateAgentTurn?.turnId;
        if (isDefined(turnId)) {
          setEvaluatingTurnIds((prev) => {
            const next = new Set(prev);
            next.delete(turnId);
            return next;
          });
        }
        enqueueSuccessSnackBar({
          message: t`Giliran berhasil dievaluasi`,
        });
        refetch();
      },
    },
  );

  const handleEvaluateTurn = (turnId: string) => {
    setEvaluatingTurnIds((prev) => new Set(prev).add(turnId));
    evaluateTurn({ variables: { turnId } }).catch(() => {
      setEvaluatingTurnIds((prev) => {
        const next = new Set(prev);
        next.delete(turnId);
        return next;
      });
      enqueueErrorSnackBar({
        message: t`Gagal mengevaluasi giliran`,
      });
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  };

  const getUserMessageInput = (messages: any[]) => {
    const userMessage = messages?.find((message) => message.role === 'user');
    if (!userMessage) return null;

    const textParts = userMessage.parts
      ?.filter((part: any) => part.type === 'text' && part.textContent)
      .map((part: any) => part.textContent);

    return textParts?.join(' ') || null;
  };

  if (loading) {
    return (
      <StyledTableContainer>
        <Table>
          <StyledTableHeaderRowContainer>
            <TableRow gridTemplateColumns="140px 80px 1fr 40px">
              <TableHeader>{t`Tanggal`}</TableHeader>
              <TableHeader>{t`Skor`}</TableHeader>
              <TableHeader>{t`Input`}</TableHeader>
              <TableHeader />
            </TableRow>
          </StyledTableHeaderRowContainer>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton height={48} borderRadius={4} key={index} />
          ))}
        </Table>
      </StyledTableContainer>
    );
  }

  if (turns.length === 0) {
    return (
      <AnimatedPlaceholderEmptyContainer>
        <AnimatedPlaceholder type="emptyTimeline" />
        <AnimatedPlaceholderEmptyTextContainer>
          <AnimatedPlaceholderEmptyTitle>
            {t`Belum ada log`}
          </AnimatedPlaceholderEmptyTitle>
          <AnimatedPlaceholderEmptySubTitle>
            {t`Riwayat percakapan agen akan muncul di sini setelah agen digunakan`}
          </AnimatedPlaceholderEmptySubTitle>
        </AnimatedPlaceholderEmptyTextContainer>
      </AnimatedPlaceholderEmptyContainer>
    );
  }

  return (
    <StyledTableContainer>
      <Table>
        <StyledTableHeaderRowContainer>
          <TableRow gridTemplateColumns="140px 80px 1fr 40px">
            <TableHeader>{t`Tanggal`}</TableHeader>
            <TableHeader>{t`Skor`}</TableHeader>
            <TableHeader>{t`Input`}</TableHeader>
            <TableHeader />
          </TableRow>
        </StyledTableHeaderRowContainer>
        {turns.map((turn: any) => {
          const latestEvaluation = getLatestEvaluation(turn.evaluations);
          const userInput = getUserMessageInput(turn.messages);

          return (
            <TableRow key={turn.id} gridTemplateColumns="140px 80px 1fr 40px">
              <TableCell color={themeCssVariables.font.color.tertiary}>
                {new Date(turn.createdAt).toLocaleDateString('id-ID', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </TableCell>
              <TableCell gap={themeCssVariables.spacing[2]}>
                {latestEvaluation ? (
                  <Status
                    color={getScoreColor(latestEvaluation.score)}
                    text={`${latestEvaluation.score}`}
                  />
                ) : evaluatingTurnIds.has(turn.id) ||
                  backgroundEvaluatingTurnIds.has(turn.id) ? (
                  <Status color="blue" text={t`Mengevaluasi`} isLoaderVisible />
                ) : (
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => handleEvaluateTurn(turn.id)}
                    disabled={evaluating}
                    title={t`Evaluasi`}
                  />
                )}
              </TableCell>
              <TableCell
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {userInput || t`Tidak ada input`}
              </TableCell>
              <TableCell
                align="right"
                padding={`0 ${themeCssVariables.spacing[2]} 0 0`}
              >
                {latestEvaluation && (
                  <UndecoratedLink
                    to={getSettingsPath(SettingsPath.AiAgentTurnDetail)
                      .replace(':agentId', agentId)
                      .replace(':turnId', turn.id)}
                  >
                    <LightIconButton
                      Icon={IconChevronRight}
                      title={t`Lihat semua evaluasi`}
                      accent="tertiary"
                    />
                  </UndecoratedLink>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </Table>
    </StyledTableContainer>
  );
};
