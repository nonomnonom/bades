const TEST_SCHEMA_NAME = 'workspace_202020201c254d02bf256aeccf7ea419';

export const deleteAllRecords = async (objectNameSingular: string) => {
  await global.testDataSource.query(
    `DELETE from "${TEST_SCHEMA_NAME}"."${objectNameSingular}"`,
  );
};
