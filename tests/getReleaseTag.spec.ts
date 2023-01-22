import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import getReleaseTag from '../src/services/releaseService';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.resetAllMocks();
});

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
])('should return first version when invalid version is passed', (input) => {
  vi.setSystemTime(new Date('2022-10-13'));
  expect(getReleaseTag(input)).toBe('v22.10.1');
});

it('should throw exception when malformed version is passed', () => {
  vi.setSystemTime(new Date('2022-10-13'));
  expect(getReleaseTag('v2.1')).toBe('v22.10.1');
});

it('should return version with same month and year with incremented iteration', () => {
  vi.setSystemTime(new Date('2022-11-24'));
  expect(getReleaseTag('v22.11.5')).toBe('v22.11.6');
});

it.each([['v22.10.23'], ['v22.2.21']])(
  'should return version with reset iteration, current month and same year',
  (input) => {
    vi.setSystemTime(new Date('2022-11-24'));
    expect(getReleaseTag(input)).toBe('v22.11.1');
  }
);

it.each([['v22.12.2'], ['v20.05.14']])(
  'should return version with reset iteration, current month and year',
  (input) => {
    vi.setSystemTime(new Date('2023-01-02'));
    expect(getReleaseTag(input)).toBe('v23.1.1');
  }
);
