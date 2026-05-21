import { type AvatarType } from 'ui/display';
export type RecordChipData = {
  recordId: string;
  name: string;
  avatarType: AvatarType;
  avatarUrl: string;
  isLabelIdentifier: boolean;
  objectNameSingular: string;
};
