import { ArgsType, Field } from '@nestjs/graphql';

import { FileFolder } from 'shared/types';

@ArgsType()
export class UploadApplicationFileInput {
  @Field(() => String)
  applicationUniversalIdentifier: string;

  @Field(() => FileFolder)
  fileFolder: FileFolder;

  @Field(() => String)
  filePath: string;
}
