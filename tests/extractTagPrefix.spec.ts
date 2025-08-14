import { describe, expect, it } from 'vitest';
import { extractTagPrefix } from '../src/utils';

describe('extractTagPrefix', () => {
  it.each(['', 'v'])(
    'returns prefix %s unchanged when no wildcard present',
    (prefix) => {
      expect(extractTagPrefix(prefix)).toBe(prefix);
    }
  );

  it.each([
    ['*', ''],
    ['v*', 'v'],
  ])('removes trailing wildcard from %s', (input, expected) => {
    expect(extractTagPrefix(input)).toBe(expected);
  });

  it.each(['v*beta', 'v**', '*foo', 'foo*bar'])(
    'throws for invalid prefix %s',
    (prefix) => {
      expect(() => extractTagPrefix(prefix)).toThrow(/Invalid tag prefix/);
    }
  );
});
