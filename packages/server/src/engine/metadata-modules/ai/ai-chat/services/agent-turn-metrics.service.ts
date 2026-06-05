import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MoreThan, Repository } from 'typeorm';

import { AgentMessagePartEntity } from 'src/engine/metadata-modules/ai/ai-agent-execution/entities/agent-message-part.entity';
import { AgentTurnEntity } from 'src/engine/metadata-modules/ai/ai-agent-execution/entities/agent-turn.entity';

export type AgentTurnMetricsSummary = {
  totalTurns: number;
  turnsWithSuccessfulTool: number;
  turnsWithToolError: number;
  turnSuccessRate: number;
  toolSuccessRate: number;
};

@Injectable()
export class AgentTurnMetricsService {
  constructor(
    @InjectRepository(AgentTurnEntity)
    private readonly turnRepository: Repository<AgentTurnEntity>,
    @InjectRepository(AgentMessagePartEntity)
    private readonly messagePartRepository: Repository<AgentMessagePartEntity>,
  ) {}

  async getWorkspaceSummary(
    workspaceId: string,
    since: Date,
  ): Promise<AgentTurnMetricsSummary> {
    const totalTurns = await this.turnRepository.count({
      where: {
        workspaceId,
        createdAt: MoreThan(since),
      },
    });

    if (totalTurns === 0) {
      return {
        totalTurns: 0,
        turnsWithSuccessfulTool: 0,
        turnsWithToolError: 0,
        turnSuccessRate: 0,
        toolSuccessRate: 0,
      };
    }

    const toolParts = await this.messagePartRepository
      .createQueryBuilder('part')
      .innerJoin('part.message', 'message')
      .innerJoin('message.turn', 'turn')
      .where('turn.workspaceId = :workspaceId', { workspaceId })
      .andWhere('turn.createdAt >= :since', { since })
      .andWhere('part.type LIKE :toolType', { toolType: 'tool-%' })
      .select(['part.messageId', 'part.state', 'part.errorMessage'])
      .getMany();

    const messageToolStatus = new Map<
      string,
      { hasSuccess: boolean; hasError: boolean }
    >();

    for (const part of toolParts) {
      const current = messageToolStatus.get(part.messageId) ?? {
        hasSuccess: false,
        hasError: false,
      };

      if (part.state === 'output-available' && !part.errorMessage) {
        current.hasSuccess = true;
      }

      if (part.errorMessage) {
        current.hasError = true;
      }

      messageToolStatus.set(part.messageId, current);
    }

    let turnsWithSuccessfulTool = 0;
    let turnsWithToolError = 0;

    for (const status of messageToolStatus.values()) {
      if (status.hasSuccess) {
        turnsWithSuccessfulTool += 1;
      }

      if (status.hasError) {
        turnsWithToolError += 1;
      }
    }

    const successfulTurns = totalTurns - turnsWithToolError;

    return {
      totalTurns,
      turnsWithSuccessfulTool,
      turnsWithToolError,
      turnSuccessRate: successfulTurns / totalTurns,
      toolSuccessRate:
        messageToolStatus.size > 0
          ? turnsWithSuccessfulTool / messageToolStatus.size
          : 0,
    };
  }
}
