import { describe, expect, it } from 'vitest';
import { parseTemplate } from '../src/services/templateService';

describe('parseTemplate', () => {
  it('parses yyyy and yy in the same template to distinct fields', () => {
    const parts = parseTemplate('yyyy.yy.i', '2025.25.05', '');
    expect(parts).toMatchObject({
      oldFullYear: 2025,
      oldShortYear: 25,
      oldItr: 5,
    });
  });

  it('parses a repeated token, last position wins (equal values here)', () => {
    const parts = parseTemplate('yy.yy.i', '26.26.05', '');
    expect(parts).toMatchObject({ oldShortYear: 26, oldItr: 5 });
  });

  describe('multi-character separator (yy--mm--i)', () => {
    it('succeeds with a null old tag (first release, itr seeded to 0)', () => {
      const parts = parseTemplate('yy--mm--i', null, '');
      expect(parts).toMatchObject({ oldItr: 0 });
    });

    it('throws with a non-null old tag due to empty split parts', () => {
      expect(() => parseTemplate('yy--mm--i', '25--09--05', '')).toThrow(
        'Old release tag contains unsupported character: '
      );
    });
  });

  it('throws for a template part that is not a known token', () => {
    expect(() => parseTemplate('yy..i', '26.5.1', '')).toThrow(
      'Template contains unrecognized character: '
    );
  });

  it('throws when the old tag is only the prefix (empty remainder)', () => {
    expect(() => parseTemplate('yy.mm.i', 'v', 'v')).toThrow(
      'Template does not represent last release tag'
    );
  });

  it('throws when the old tag does not start with the prefix', () => {
    expect(() => parseTemplate('yy.mm.i', '26.07.01', 'v')).toThrow(
      'Old release tag "26.07.01" does not start with the tag prefix "v"'
    );
  });
});
