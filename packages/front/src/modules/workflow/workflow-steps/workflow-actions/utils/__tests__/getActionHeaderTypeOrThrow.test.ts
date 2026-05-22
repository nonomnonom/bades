import { getActionHeaderTypeOrThrow } from '@/workflow/workflow-steps/workflow-actions/utils/getActionHeaderTypeOrThrow';

describe('getActionHeaderTypeOrThrow', () => {
  it('should return "Core" for CODE action type', () => {
    expect(getActionHeaderTypeOrThrow('CODE')).toBe('Core');
  });

  it('should return "Record" for record-related action types', () => {
    const recordActionTypes = [
      'CREATE_RECORD',
      'UPDATE_RECORD',
      'DELETE_RECORD',
      'FIND_RECORDS',
    ] as const;

    recordActionTypes.forEach((type) => {
      expect(getActionHeaderTypeOrThrow(type)).toBe('Record');
    });
  });

  it('should return "Human Input" for FORM action type', () => {
    expect(getActionHeaderTypeOrThrow('FORM')).toBe('Human Input');
  });

  it('should return "Core" for SEND_EMAIL action type', () => {
    expect(getActionHeaderTypeOrThrow('SEND_EMAIL')).toBe('Core');
  });

  it('should return "Core" for HTTP_REQUEST action type', () => {
    expect(getActionHeaderTypeOrThrow('HTTP_REQUEST')).toBe('Core');
  });

  it('should return "AI" for AI_AGENT action type', () => {
    expect(getActionHeaderTypeOrThrow('AI_AGENT')).toBe('AI');
  });
});
