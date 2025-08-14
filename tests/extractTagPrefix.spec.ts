import { describe, expect, it } from 'vitest';
import { extractTagPrefix } from '../src/utils';

describe('extractTagPrefix', () => {
  it('returns prefix unchanged when no wildcard present', () => {
    expect(extractTagPrefix('')).toBe('');
    expect(extractTagPrefix('v')).toBe('v');
  });

  it('removes trailing wildcard when present', () => {
    expect(extractTagPrefix('*')).toBe('');
    expect(extractTagPrefix('v*')).toBe('v');
  });

  it.each(['v*beta', 'v**', '*foo', 'foo*bar'])(
    'throws for invalid prefix %s',
    (prefix) => {
      expect(() => extractTagPrefix(prefix)).toThrow(/Invalid tag prefix/);
    }
  );
});
