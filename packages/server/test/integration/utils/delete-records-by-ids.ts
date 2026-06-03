import { SEED_SUKAMAJU_WORKSPACE_ID } from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';
import { getWorkspaceSchemaName } from 'src/engine/workspace-datasource/utils/get-workspace-schema-name.util';

const TEST_SCHEMA_NAME = getWorkspaceSchemaName(SEED_SUKAMAJU_WORKSPACE_ID);

export const deleteRecordsByIds = async (
  objectNameSingular: string,
  recordIds: string[],
) => {
  if (!recordIds.length) {
    return;
  }

  try {
    // Create placeholders for parameterized query: $1, $2, $3, etc.
    const placeholders = recordIds
      .map((_, index) => `$${index + 1}`)
      .join(', ');

    await global.testDataSource.query(
      `DELETE from "${TEST_SCHEMA_NAME}"."${objectNameSingular}" WHERE id IN (${placeholders})`,
      recordIds,
    );
  } catch {
    /* empty */
  }
};
