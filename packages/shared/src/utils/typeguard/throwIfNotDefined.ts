export const throwIfNotDefined = <T>(
  value: T,
  variableName: string,
): asserts value is NonNullable<T> => {
  if (value === null || value === undefined) {
    throw new Error(
      `Nilai harus terdefinisi untuk variabel ${variableName}, ini tidak boleh terjadi`,
    );
  }
};
