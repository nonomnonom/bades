import { msg } from '~/utils/i18n/badesI18n';
import { type StepIfElseBranch } from 'shared/workflow';
import { isDefined } from 'shared/utils';

export const getBranchLabel = ({
  branchIndex,
  totalBranches,
  branch,
}: {
  branchIndex: number;
  totalBranches: number;
  branch?: StepIfElseBranch;
}): string => {
  if (branchIndex === 0) {
    return "if";
  }

  const isElseBranch =
    branchIndex === totalBranches - 1 &&
    (!isDefined(branch) || !isDefined(branch.filterGroupId));

  if (isElseBranch) {
    return "else";
  }

  return "else if";
};
