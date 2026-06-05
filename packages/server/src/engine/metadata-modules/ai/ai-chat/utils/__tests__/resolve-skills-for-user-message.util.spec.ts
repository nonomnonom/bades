import {
  buildAutoLoadedSkillsSection,
  resolveSkillsForUserMessage,
} from 'src/engine/metadata-modules/ai/ai-chat/utils/resolve-skills-for-user-message.util';

describe('resolveSkillsForUserMessage', () => {
  it('mengembalikan skill dashboard untuk intent dasbor', () => {
    expect(resolveSkillsForUserMessage('Buat dasbor aktivitas desa')).toEqual([
      'dashboard-building',
    ]);
  });

  it('mengembalikan beberapa skill untuk intent view', () => {
    expect(
      resolveSkillsForUserMessage('Atur tampilan dan filter data'),
    ).toEqual(['view-building', 'view-filters-and-sorts']);
  });

  it('membangun section auto-loaded skills', () => {
    const section = buildAutoLoadedSkillsSection([
      { name: 'dashboard-building', content: 'Panduan dasbor' },
    ]);

    expect(section).toContain('Auto-loaded Skills');
    expect(section).toContain('dashboard-building');
    expect(section).toContain('Panduan dasbor');
  });
});
