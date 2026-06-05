const SKILL_INTENT_KEYWORDS: Array<{ patterns: RegExp; skills: string[] }> = [
  {
    patterns: /dashboard|dasbor|grafik|chart/i,
    skills: ['dashboard-building'],
  },
  {
    patterns: /workflow|alur kerja|otomatisasi/i,
    skills: ['workflow-building'],
  },
  {
    patterns: /view|tampilan|filter/i,
    skills: ['view-building', 'view-filters-and-sorts'],
  },
  {
    patterns: /metadata|objek|field/i,
    skills: ['metadata-building'],
  },
  {
    patterns: /excel|xlsx|export/i,
    skills: ['xlsx', 'code-interpreter'],
  },
  {
    patterns: /riset|cari di web|pencarian web/i,
    skills: ['research'],
  },
];

export const resolveSkillsForUserMessage = (message: string): string[] => {
  const normalizedMessage = message.trim();

  if (normalizedMessage === '') {
    return [];
  }

  const matchedSkills = new Set<string>();

  for (const { patterns, skills } of SKILL_INTENT_KEYWORDS) {
    if (patterns.test(normalizedMessage)) {
      for (const skill of skills) {
        matchedSkills.add(skill);
      }
    }
  }

  return [...matchedSkills];
};

export const buildAutoLoadedSkillsSection = (
  skills: Array<{ name: string; content: string }>,
): string | undefined => {
  if (skills.length === 0) {
    return undefined;
  }

  const skillBlocks = skills
    .map((skill) => `### Skill: ${skill.name}\n${skill.content.trim()}`)
    .join('\n\n');

  return `## Auto-loaded Skills

The following skills were automatically loaded based on the user's message intent. Use them as guidance; you may still call load_skills for additional skills.

${skillBlocks}`;
};
