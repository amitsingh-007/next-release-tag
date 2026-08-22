import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getNewReleaseTag } from '../src/services/releaseService';
import { AllowedParts, IAllowedTemplate } from '../src/types';
import { getTestCase, validTemplates } from './utils/testCase';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.resetAllMocks();
});

const { fullYear, shortYear, month, day } = IAllowedTemplate;

// Each scenario pairs a date change with the tokens that must reset the
// iteration when the template carries them. Every scenario runs against no
// prefix as well as its own, so prefix handling is covered without duplicating
// the table.
const SCENARIOS = [
  {
    name: 'same date',
    now: '2022-10-13',
    old: '2022-10-13',
    oldItr: 4,
    prefix: 'v',
    resetOn: [],
  },
  {
    name: 'changed day',
    now: '2022-10-13',
    old: '2022-10-10',
    oldItr: 4,
    prefix: 'abc',
    resetOn: [day],
  },
  {
    name: 'changed month',
    now: '2022-10-12',
    old: '2022-01-12',
    oldItr: 1,
    prefix: 'v',
    resetOn: [month],
  },
  {
    name: 'changed year',
    now: '2023-09-28',
    old: '2022-09-28',
    oldItr: 41,
    prefix: '10',
    resetOn: [fullYear, shortYear],
  },
  {
    name: 'changed month and year',
    now: '2023-04-18',
    old: '2022-11-18',
    oldItr: 166,
    prefix: '@',
    resetOn: [fullYear, shortYear, month],
  },
  {
    name: 'changed day and month',
    now: '2023-06-15',
    old: '2023-03-25',
    oldItr: 5,
    prefix: '__',
    resetOn: [day, month],
  },
  {
    name: 'changed day and year',
    now: '2023-12-11',
    old: '2021-12-17',
    oldItr: 12,
    prefix: '_v_',
    resetOn: [day, fullYear, shortYear],
  },
];

const CASES = SCENARIOS.flatMap((scenario) =>
  ['', scenario.prefix].flatMap((prefix) =>
    validTemplates.map((template) => ({ scenario, prefix, template }))
  )
);

describe('test valid cases', () => {
  it.each(['', 'v'])(
    'should return tag when no old release tag exists for prefix "%s"',
    (prefix) => {
      vi.setSystemTime(new Date('2022-10-13'));
      expect(getNewReleaseTag(prefix, 'yy.mm.dd.i', null)).toBe(
        `${prefix}22.10.13.01`
      );
    }
  );

  it.each(CASES)(
    '$scenario.name with prefix "$prefix" for template $template',
    ({ scenario, prefix, template }) => {
      const { now, old, oldItr, resetOn } = scenario;
      vi.setSystemTime(new Date(now));
      const resets = resetOn.some((token) => template.includes(token));
      const { oldTag, expectedTag } = getTestCase({
        template,
        oldDate: new Date(old),
        oldItr,
        newItr: resets ? 1 : oldItr + 1,
        prefix,
      });
      expect(getNewReleaseTag(prefix, template, oldTag)).toBe(expectedTag);
    }
  );
});

describe('test invalid cases', () => {
  it('should throw error for no template', () => {
    expect(() => getNewReleaseTag('v', null, 'v2023.10.1')).toThrow(
      'Template not found'
    );
  });
  it('should throw error when old release doesnt start with prefix', () => {
    expect(() => getNewReleaseTag('v', 'yy.mm.i', '20.10.5')).toThrow(
      'Old release tag "20.10.5" does not start with the tag prefix "v"'
    );
  });
  it.each(['yymmi', ...AllowedParts])(
    'should throw error when no separator is in template',
    (template) => {
      expect(() => getNewReleaseTag('', template, '20.10.5')).toThrow(
        'Template must have a separator'
      );
    }
  );
  it('should throw error when template has >1 separator in template', () => {
    expect(() => getNewReleaseTag('', 'yy.mm-i', '20.10.5')).toThrow(
      'Template cannot have more than one separator'
    );
  });
  it.each(['yymm.i', '-yy-mm-i', 'yy-mm-i-'])(
    'should throw error when template: %s and release tag doesnt match',
    (template) => {
      expect(() => getNewReleaseTag('', template, '20.10.5')).toThrow(
        'Template does not represent last release tag'
      );
    }
  );
  it.each(['2023.ab.1', 'h2.z.1#2', '123123.@.', 'false.true. hg '])(
    'should throw error when template: %s and release tag doesnt match',
    (oldTag) => {
      expect(() => getNewReleaseTag('', 'yyyy.dd.i', oldTag)).toThrow(
        /Old release tag contains unsupported character:/
      );
    }
  );
});

describe('test edge cases', () => {
  it('renders short year as 00 on the 2100 wraparound (first release)', () => {
    vi.setSystemTime(new Date('2100-01-01'));
    expect(getNewReleaseTag('', 'yy.mm.dd.i', null)).toBe('00.01.01.01');
  });

  it('resets iteration when the short year wraps to 00', () => {
    vi.setSystemTime(new Date('2100-03-05'));
    expect(getNewReleaseTag('', 'yy.mm.dd.i', '99.03.05.07')).toBe(
      '00.03.05.01'
    );
  });

  it('increments a large iteration without padding when the date is unchanged', () => {
    vi.setSystemTime(new Date('2026-07-21'));
    // Yy/mm match the current date, so itr increments instead of resetting.
    expect(getNewReleaseTag('', 'yy.mm.i', '26.07.200')).toBe('26.07.201');
  });

  it('resets a large iteration when a date token changes (reset trap)', () => {
    vi.setSystemTime(new Date('2026-07-21'));
    // Year and month differ, so the large itr resets to 01 rather than incrementing.
    expect(getNewReleaseTag('', 'yy.mm.i', '25.10.200')).toBe('26.07.01');
  });

  it('preserves a multi-character separator for a first release', () => {
    vi.setSystemTime(new Date('2026-07-21'));
    expect(getNewReleaseTag('', 'yy--mm--i', null)).toBe('26--07--01');
  });

  it('injects a repeated token into every position', () => {
    vi.setSystemTime(new Date('2026-07-21'));
    expect(getNewReleaseTag('', 'yy.yy.i', '26.26.05')).toBe('26.26.06');
  });
});
