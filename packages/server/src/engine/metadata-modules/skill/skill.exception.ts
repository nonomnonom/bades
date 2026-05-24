import { type MessageDescriptor, msg } from 'src/utils/bades-i18n';
import { assertUnreachable } from 'shared/utils';

import { CustomException } from 'src/utils/custom-exception';

export enum SkillExceptionCode {
  SKILL_NOT_FOUND = 'SKILL_NOT_FOUND',
  SKILL_ALREADY_EXISTS = 'SKILL_ALREADY_EXISTS',
  SKILL_IS_STANDARD = 'SKILL_IS_STANDARD',
  INVALID_SKILL_INPUT = 'INVALID_SKILL_INPUT',
}

const getSkillExceptionUserFriendlyMessage = (code: SkillExceptionCode) => {
  switch (code) {
    case SkillExceptionCode.SKILL_NOT_FOUND:
      return msg`Skill tidak ditemukan.`;
    case SkillExceptionCode.SKILL_ALREADY_EXISTS:
      return msg`Skill dengan nama ini sudah ada.`;
    case SkillExceptionCode.SKILL_IS_STANDARD:
      return msg`Skill standar tidak dapat diubah.`;
    case SkillExceptionCode.INVALID_SKILL_INPUT:
      return msg`Input skill tidak valid.`;
    default:
      assertUnreachable(code);
  }
};

export class SkillException extends CustomException<SkillExceptionCode> {
  constructor(
    message: string,
    code: SkillExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ?? getSkillExceptionUserFriendlyMessage(code),
    });
  }
}
