import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import getReleaseTag from '../src/services/releaseService';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.resetAllMocks();
});

describe('test with prefix', () => {
  it.each([
    [undefined],
    [null],
    ['abc'],
    ['1.0.0'],
    ['22.1.6'],
    ['v'],
    ['v2'],
    ['v2.1'],
    ['v2.1.1.5'],
    ['v22.11.3-beta'],
  ])(
    'should return first version when invalid version is passed',
    (input: string | null | undefined) => {
      vi.setSystemTime(new Date('2022-10-13'));
      expect(getReleaseTag('v', input)).toBe('v22.10.1');
    }
  );

  it('should throw exception when malformed version is passed', () => {
    vi.setSystemTime(new Date('2022-10-13'));
    expect(getReleaseTag('v', 'v2.1')).toBe('v22.10.1');
  });

  it('should return version with same month and year with incremented iteration', () => {
    vi.setSystemTime(new Date('2022-11-24'));
    expect(getReleaseTag('v', 'v22.11.5')).toBe('v22.11.6');
  });

  it.each([['v22.10.23'], ['v22.2.21']])(
    'should return version with reset iteration, current month and same year',
    (input: string | null | undefined) => {
      vi.setSystemTime(new Date('2022-11-24'));
      expect(getReleaseTag('v', input)).toBe('v22.11.1');
    }
  );

  it.each([['v22.12.2'], ['v20.05.14']])(
    'should return version with reset iteration, current month and year',
    (input: string | null | undefined) => {
      vi.setSystemTime(new Date('2023-01-02'));
      expect(getReleaseTag('v', input)).toBe('v23.1.1');
    }
  );
});

describe('test without prefix', () => {
  it.each([
    [undefined],
    [null],
    ['1.0.0'],
    ['v22.1.6'],
    ['v'],
    ['2'],
    ['2.1'],
    ['2.1.1.5'],
    ['22.11.3-beta'],
  ])(
    'should return first version when invalid version is passed',
    (input: string | null | undefined) => {
      vi.setSystemTime(new Date('2022-10-13'));
      expect(getReleaseTag('', input)).toBe('22.10.1');
    }
  );

  it('should not throw exception when malformed version is passed', () => {
    vi.setSystemTime(new Date('2022-10-13'));
    expect(getReleaseTag('', '2.1')).toBe('22.10.1');
  });

  it('should return version with same month and year with incremented iteration', () => {
    vi.setSystemTime(new Date('2022-11-24'));
    expect(getReleaseTag('', '22.11.5')).toBe('22.11.6');
  });

  it.each([['22.10.23'], ['22.2.21']])(
    'should return version with reset iteration, current month and same year',
    (input: string | null | undefined) => {
      vi.setSystemTime(new Date('2022-11-24'));
      expect(getReleaseTag('', input)).toBe('22.11.1');
    }
  );

  it.each([['22.12.2'], ['20.05.14']])(
    'should return version with reset iteration, current month and year',
    (input: string | null | undefined) => {
      vi.setSystemTime(new Date('2023-01-02'));
      expect(getReleaseTag('', input)).toBe('23.1.1');
    }
  );
});
