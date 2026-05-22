import { ViewFilterOperand } from 'shared/types';

import { capitalize } from 'shared/utils';
import {
  getOperandLabel,
  getOperandLabelShort,
} from '@/object-record/object-filter-dropdown/utils/getOperandLabel';

describe('getOperandLabel', () => {
  const testCases = [
    [ViewFilterOperand.CONTAINS, 'Berisi'],
    [ViewFilterOperand.DOES_NOT_CONTAIN, 'Tidak berisi'],
    [ViewFilterOperand.GREATER_THAN_OR_EQUAL, 'Lebih besar atau sama dengan'],
    [ViewFilterOperand.LESS_THAN_OR_EQUAL, 'Lebih kecil atau sama dengan'],
    [ViewFilterOperand.IS, 'Sama dengan'],
    [ViewFilterOperand.IS_NOT, 'Tidak sama dengan'],
    [ViewFilterOperand.IS_NOT_NULL, 'Terisi'],
    [undefined, ''], // undefined operand
  ];

  testCases.forEach(([operand, expectedLabel]) => {
    const formattedOperand = capitalize(operand || 'undefined');

    it(`should return correct label for ViewFilterOperand.${formattedOperand}`, () => {
      const result = getOperandLabel(operand as ViewFilterOperand);
      expect(result).toBe(expectedLabel);
    });
  });
});

describe('getOperandLabelShort', () => {
  const testCases = [
    [ViewFilterOperand.IS, ': '],
    [ViewFilterOperand.CONTAINS, ': '],
    [ViewFilterOperand.IS_NOT, ': Bukan'],
    [ViewFilterOperand.DOES_NOT_CONTAIN, ': Bukan'],
    [ViewFilterOperand.IS_NOT_NULL, ': Terisi'],
    [ViewFilterOperand.GREATER_THAN_OR_EQUAL, '\u00A0≥ '],
    [ViewFilterOperand.LESS_THAN_OR_EQUAL, '\u00A0≤ '],
    [undefined, ': '], // undefined operand
  ];

  testCases.forEach(([operand, expectedLabel]) => {
    const formattedOperand = capitalize(operand || 'undefined');

    it(`should return correct short label for ViewFilterOperand.${formattedOperand}`, () => {
      const result = getOperandLabelShort(operand as ViewFilterOperand);
      expect(result).toBe(expectedLabel);
    });
  });
});
