import { Field, ObjectType } from '@nestjs/graphql';

import { WorkspaceUrlsAndIdDTO } from 'src/engine/core-modules/workspace/dtos/workspace-subdomain-id.dto';

import { AuthToken } from './auth-token.dto';

@ObjectType('SignUp')
export class SignUpDTO {
  @Field(() => AuthToken, { nullable: true })
  loginToken: AuthToken | null;

  @Field(() => WorkspaceUrlsAndIdDTO)
  workspace: WorkspaceUrlsAndIdDTO;
}
