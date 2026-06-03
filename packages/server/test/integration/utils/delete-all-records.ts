import { SEED_SUKAMAJU_WORKSPACE_ID } from 'src/engine/workspace-manager/dev-seeder/core/constants/seeder-workspaces.constant';
import { getWorkspaceSchemaName } from 'src/engine/workspace-datasource/utils/get-workspace-schema-name.util';

const TEST_SCHEMA_NAME = getWorkspaceSchemaName(SEED_SUKAMAJU_WORKSPACE_ID);

export const deleteAllRecords = async (objectNameSingular: string) => {
  await global.testDataSource.query(
    `DELETE from "${TEST_SCHEMA_NAME}"."${objectNameSingular}"`,
  );
};
