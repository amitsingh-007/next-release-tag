import { describe, expect, it } from 'vitest';
import TagBuilder from '../src/services/tagBuilder';
import { IAllowedTemplate } from '../src/types';

describe('TagBuilder', () => {
  it('returns the template unchanged when addPrefix is never called', () => {
    const result = new TagBuilder('yy.mm.i')
      .inject(IAllowedTemplate.shortYear, 26)
      .inject(IAllowedTemplate.month, 7)
      .inject(IAllowedTemplate.itr, 1)
      .build();
    expect(result).toBe('26.07.01');
  });

  it('applies no prefix when addPrefix is called with an empty string', () => {
    const result = new TagBuilder('yy.i')
      .inject(IAllowedTemplate.shortYear, 26)
      .inject(IAllowedTemplate.itr, 3)
      .addPrefix('')
      .build();
    expect(result).toBe('26.03');
  });

  it('prepends a non-empty prefix', () => {
    const result = new TagBuilder('yy.i')
      .inject(IAllowedTemplate.shortYear, 26)
      .inject(IAllowedTemplate.itr, 3)
      .addPrefix('v')
      .build();
    expect(result).toBe('v26.03');
  });

  it.each([
    [0, '00'],
    [5, '05'],
    [9, '09'],
    [10, '10'],
    [99, '99'],
    [100, '100'],
    [167, '167'],
  ])('zero-pads values below 10 only (%i -> %s)', (value, expected) => {
    const result = new TagBuilder('i')
      .inject(IAllowedTemplate.itr, value)
      .build();
    expect(result).toBe(expected);
  });

  it('replaces every occurrence of a repeated token', () => {
    const result = new TagBuilder('yy.yy.i')
      .inject(IAllowedTemplate.shortYear, 26)
      .inject(IAllowedTemplate.itr, 1)
      .build();
    expect(result).toBe('26.26.01');
  });

  it('returns this from inject and addPrefix for fluent chaining', () => {
    const builder = new TagBuilder('yy.i');
    expect(builder.inject(IAllowedTemplate.shortYear, 26)).toBe(builder);
    expect(builder.addPrefix('v')).toBe(builder);
  });
});
