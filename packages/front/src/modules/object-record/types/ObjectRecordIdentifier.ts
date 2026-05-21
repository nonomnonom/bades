import { type AvatarType } from 'ui/display';
export type ObjectRecordIdentifier = {
  id: string;
  name: string;
  avatarUrl?: string;
  avatarType?: AvatarType | null;
  linkToShowPage?: string;
};
