import { type FeatureFlagKey } from 'shared/types';

export type FeatureFlagMap = Record<`${FeatureFlagKey}`, boolean>;
