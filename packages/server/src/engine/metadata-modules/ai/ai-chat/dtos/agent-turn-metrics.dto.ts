import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('AgentTurnMetrics')
export class AgentTurnMetricsDTO {
  @Field(() => Int)
  totalTurns: number;

  @Field(() => Int)
  turnsWithSuccessfulTool: number;

  @Field(() => Int)
  turnsWithToolError: number;

  @Field(() => Float)
  turnSuccessRate: number;

  @Field(() => Float)
  toolSuccessRate: number;
}
