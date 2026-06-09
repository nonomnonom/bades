import { isRunningFromCompiledDist } from 'src/constants/assets-path';

describe('isRunningFromCompiledDist', () => {
  it('mendeteksi path dist di Unix', () => {
    expect(
      isRunningFromCompiledDist(
        '/home/user/bades/packages/server/dist/constants',
      ),
    ).toBe(true);
  });

  it('mendeteksi path dist di Windows', () => {
    expect(
      isRunningFromCompiledDist(
        'D:\\bades\\packages\\server\\dist\\constants',
      ),
    ).toBe(true);
  });

  it('false untuk source TypeScript (jest/ts-node)', () => {
    expect(
      isRunningFromCompiledDist(
        '/home/user/bades/packages/server/src/constants',
      ),
    ).toBe(false);
  });
});
