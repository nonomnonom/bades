export enum errors {
  LabelNotUnique = 'LABEL_NOT_UNIQUE',
  LabelNotFormattable = 'LABEL_NOT_FORMATTABLE',
  LabelEmpty = 'LABEL_EMPTY',
}

export const getErrorMessageFromError = (error?: string) => {
  switch (error) {
    case errors.LabelEmpty:
      return 'Nama tidak boleh kosong.';
    case errors.LabelNotFormattable:
      return 'Nama harus dimulai dengan huruf.';
    case errors.LabelNotUnique:
      return 'Nama ini sudah digunakan.';
    default:
      return '';
  }
};
