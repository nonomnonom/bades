import { isValidBadesSubdomain } from '@/utils/validation/isValidBadesSubdomain';

describe('isValidBadesSubdomain', () => {
  describe('valid subdomains', () => {
    it('should accept standard alphanumeric subdomains', () => {
      expect(isValidBadesSubdomain('abc')).toBe(true);
      expect(isValidBadesSubdomain('test123')).toBe(true);
      expect(isValidBadesSubdomain('company1')).toBe(true);
      expect(isValidBadesSubdomain('workspace2024')).toBe(true);
    });

    it('should accept subdomains with hyphens in the middle', () => {
      expect(isValidBadesSubdomain('my-keluarga')).toBe(true);
      expect(isValidBadesSubdomain('test-workspace')).toBe(true);
      expect(isValidBadesSubdomain('multi-word-subdomain')).toBe(true);
      expect(isValidBadesSubdomain('a-b-c-d-e')).toBe(true);
    });

    it('should accept minimum length subdomains (3 characters)', () => {
      expect(isValidBadesSubdomain('abc')).toBe(true);
      expect(isValidBadesSubdomain('a1b')).toBe(true);
      expect(isValidBadesSubdomain('a-b')).toBe(true);
    });

    it('should accept maximum length subdomains (30 characters)', () => {
      const exactly30 = 'a' + 'b'.repeat(28) + 'c';

      expect(exactly30.length).toBe(30);
      expect(isValidBadesSubdomain(exactly30)).toBe(true);
    });

    it('should accept numeric-only subdomains', () => {
      expect(isValidBadesSubdomain('123')).toBe(true);
      expect(isValidBadesSubdomain('456789')).toBe(true);
      expect(isValidBadesSubdomain('1-2-3')).toBe(true);
    });
  });

  describe('invalid subdomains', () => {
    it('should reject empty strings', () => {
      expect(isValidBadesSubdomain('')).toBe(false);
    });

    it('should reject subdomains shorter than 3 characters', () => {
      expect(isValidBadesSubdomain('a')).toBe(false);
      expect(isValidBadesSubdomain('ab')).toBe(false);
    });

    it('should reject subdomains longer than 30 characters', () => {
      const tooLong = 'a'.repeat(31);

      expect(isValidBadesSubdomain(tooLong)).toBe(false);
    });

    it('should reject subdomains starting with a hyphen', () => {
      expect(isValidBadesSubdomain('-test')).toBe(false);
      expect(isValidBadesSubdomain('-abc')).toBe(false);
    });

    it('should reject subdomains ending with a hyphen', () => {
      expect(isValidBadesSubdomain('test-')).toBe(false);
      expect(isValidBadesSubdomain('abc-')).toBe(false);
    });

    it('should reject subdomains with uppercase letters', () => {
      expect(isValidBadesSubdomain('Test')).toBe(false);
      expect(isValidBadesSubdomain('MyCompany')).toBe(false);
      expect(isValidBadesSubdomain('WORKSPACE')).toBe(false);
    });

    it('should reject subdomains with special characters', () => {
      expect(isValidBadesSubdomain('test@keluarga')).toBe(false);
      expect(isValidBadesSubdomain('my_workspace')).toBe(false);
      expect(isValidBadesSubdomain('test.keluarga')).toBe(false);
      expect(isValidBadesSubdomain('workspace#1')).toBe(false);
    });

    it('should reject subdomains with spaces', () => {
      expect(isValidBadesSubdomain('test keluarga')).toBe(false);
      expect(isValidBadesSubdomain(' test')).toBe(false);
      expect(isValidBadesSubdomain('test ')).toBe(false);
    });

    it('should reject subdomains starting with "api-"', () => {
      expect(isValidBadesSubdomain('api-test')).toBe(false);
      expect(isValidBadesSubdomain('api-keluarga')).toBe(false);
      expect(isValidBadesSubdomain('api-123')).toBe(false);
    });

    it('should accept subdomains containing "api" not as prefix', () => {
      expect(isValidBadesSubdomain('myapi')).toBe(true);
      expect(isValidBadesSubdomain('rapid')).toBe(true);
    });

    it('should reject subdomains with only hyphens', () => {
      expect(isValidBadesSubdomain('---')).toBe(false);
      expect(isValidBadesSubdomain('----')).toBe(false);
    });

    it('should reject whitespace-only strings', () => {
      expect(isValidBadesSubdomain('   ')).toBe(false);
      expect(isValidBadesSubdomain('\t')).toBe(false);
      expect(isValidBadesSubdomain('\n')).toBe(false);
    });

    it('should reject unicode characters', () => {
      expect(isValidBadesSubdomain('café')).toBe(false);
      expect(isValidBadesSubdomain('tëst')).toBe(false);
    });
  });
});
