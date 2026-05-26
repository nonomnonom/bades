export const getObjectFilterFields = (objectSingleName: string) => {
  if (['workspaceMember', 'penduduk'].includes(objectSingleName)) {
    return ['name.firstName', 'name.lastName'];
  }

  return ['name'];
};
