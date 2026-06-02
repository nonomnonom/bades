/**
 * S3 Lifecycle Rules Configuration
 *
 * Provides lifecycle rules for S3 bucket management:
 * - Version expiration (30 days for old versions)
 * - Incomplete multipart upload cleanup (7 days)
 *
 * Note: Actual implementation requires manual setup via AWS Console or SDK when bucket created.
 * This file documents the intended lifecycle rules.
 */

export interface S3LifecycleRule {
  /** Unique identifier for the rule */
  ID: string;
  /** Whether the rule is enabled */
  Status: 'Enabled' | 'Disabled';
  /** Lifecycle rule filter */
  Filter: {
    Prefix?: string;
  };
  /** Actions for noncurrent versions */
  NoncurrentVersionExpiration?: {
    /** Days before expiring noncurrent versions */
    NoncurrentDays: number;
  };
  /** Actions for incomplete multipart uploads */
  AbortIncompleteMultipartUpload?: {
    /** Days after initiation before aborting */
    DaysAfterInitiation: number;
  };
}

/**
 * Default lifecycle rules untuk S3 bucket management.
 * Documents recommended rules - actual application requires AWS SDK setup.
 */
export const DEFAULT_S3_LIFECYCLE_RULES: S3LifecycleRule[] = [
  {
    ID: 'delete-old-versions',
    Status: 'Enabled',
    Filter: {},
    NoncurrentVersionExpiration: {
      NoncurrentDays: 30,
    },
  },
  {
    ID: 'abort-incomplete-uploads',
    Status: 'Enabled',
    Filter: {},
    AbortIncompleteMultipartUpload: {
      DaysAfterInitiation: 7,
    },
  },
];

/**
 * Placeholder for lifecycle rules application.
 * Currently lifecycle rules perlu di-set melalui AWS Console atau script eksternal.
 *
 * Untuk apply via AWS CLI:
 * ```bash
 * aws s3api put-bucket-lifecycle-configuration \
 *   --bucket your-bucket-name \
 *   --lifecycle-configuration file://lifecycle.json
 * ```
 *
 * Atau via SDK dengan GetBucketLifecycleConfiguration/GetBucketLifecycleConfigurationCommand
 */
import type { S3Client } from '@aws-sdk/client-s3';

export const applyLifecycleRules = async (
  _s3Client: S3Client,
  _bucketName: string,
): Promise<void> => {
  // Lifecycle rules application would go here when needed
  // Currently documented for manual AWS Console setup
  console.log('S3 lifecycle rules: configure via AWS Console or AWS CLI');
};
