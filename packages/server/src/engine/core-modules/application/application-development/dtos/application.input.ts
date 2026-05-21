import { ArgsType, Field } from '@nestjs/graphql';

import GraphQLJSON from 'graphql-type-json';
import { Manifest } from 'shared/application';

@ArgsType()
export class ApplicationInput {
  @Field(() => GraphQLJSON, { nullable: false })
  manifest: Manifest;
}
