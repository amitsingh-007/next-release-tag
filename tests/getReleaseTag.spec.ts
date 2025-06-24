import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getNewReleaseTag } from '../src/services/releaseService';
import { AllowedParts, IAllowedTemplate } from '../src/types';
import { validTemplates } from './testData';
import { getTestCase } from './utils/testCase';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.resetAllMocks();
});

describe('test valid cases without prefix', () => {
  it('should return tag when no old release tag exists', () => {
    vi.setSystemTime(new Date('2022-10-13'));
    const actualTag = getNewReleaseTag('', 'yy.mm.dd.i', null);
    expect(actualTag).toBe('22.10.13.01');
  });
  it.each(validTemplates)(
    'should return changed itr for same date for template: %s',
    (template) => {
      vi.setSystemTime(new Date('2022-10-13'));
      const { oldTag, expectedTag } = getTestCase({
        template,
        oldItr: 4,
        newItr: 5,
      });
      const actualTag = getNewReleaseTag('', template, oldTag);
      expect(actualTag).toBe(expectedTag);
    }
  );
  it.each(validTemplates)(
    'should return reset itr for changed day for template: %s',
    (template) => {
      vi.setSystemTime(new Date('2022-10-13'));
      const { oldTag, expectedTag } = getTestCase({
        template,
        oldDate: new Date('2022-10-10'),
        oldItr: 4,
        newItr: template.includes(IAllowedTemplate.day) ? 1 : 5,
      });
      const actualTag = getNewReleaseTag('', template, oldTag);
      expect(actualTag).toBe(expectedTag);
    }
  );
  it.each(validTemplates)(
    'should return reset itr for changed month for template: %s',
    (template) => {
      vi.setSystemTime(new Date('2022-10-12'));
      const { oldTag, expectedTag } = getTestCase({
        template,
        oldDate: new Date('2022-01-12'),
        oldItr: 1,
        newItr: template.includes(IAllowedTemplate.month) ? 1 : 2,
      });
      const actualTag = getNewReleaseTag('', template, oldTag);
      expect(actualTag).toBe(expectedTag);
    }
  );
  it.each(validTemplates)(
    'should return reset itr for changed year for template: %s',
    (template) => {
      vi.setSystemTime(new Date('2023-09-28'));
      const { oldTag, expectedTag } = getTestCase({
        template,
        oldDate: new Date('2022-09-28'),
        oldItr: 41,
        newItr:
          template.includes(IAllowedTemplate.fullYear) ||
          template.includes(IAllowedTemplate.shortYear)
            ? 1
            : 42,
      });
      const actualTag = getNewReleaseTag('', template, oldTag);
      expect(actualTag).toBe(expectedTag);
    }
  );
  it.each(validTemplates)(
    'should return reset itr for changed month/year for template: %s',
    (template) => {
      vi.setSystemTime(new Date('2023-04-18'));
      const { oldTag, expectedTag } = getTestCase({
        template,
        oldDate: new Date('2022-11-18'),
        oldItr: 166,
        newItr:
          template.includes(IAllowedTemplate.fullYear) ||
          template.includes(IAllowedTemplate.shortYear) ||
          template.includes(IAllowedTemplate.month)
            ? 1
            : 167,
      });
      const actualTag = getNewReleaseTag('', template, oldTag);
      expect(actualTag).toBe(expectedTag);
    }
  );
  it.each(validTemplates)(
    'should return reset itr for changed date/month for template: %s',
    (template) => {
      vi.setSystemTime(new Date('2023-06-15'));
      const { oldTag, expectedTag } = getTestCase({
        template,
        oldDate: new Date('2023-03-25'),
        oldItr: 5,
        newItr:
          template.includes(IAllowedTemplate.day) ||
          template.includes(IAllowedTemplate.month)
            ? 1
            : 6,
      });
      const actualTag = getNewReleaseTag('', template, oldTag);
      expect(actualTag).toBe(expectedTag);
    }
  );
  it.each(validTemplates)(
    'should return reset itr for changed date/year for template: %s',
    (template) => {
      vi.setSystemTime(new Date('2023-12-11'));
      const { oldTag, expectedTag } = getTestCase({
        template,
        oldDate: new Date('2021-12-17'),
        oldItr: 12,
        newItr:
          template.includes(IAllowedTemplate.day) ||
          template.includes(IAllowedTemplate.fullYear) ||
          template.includes(IAllowedTemplate.shortYear)
            ? 1
            : 13,
      });
      const actualTag = getNewReleaseTag('', template, oldTag);
      expect(actualTag).toBe(expectedTag);
    }
  );
});

describe('test valid cases with prefix', () => {
  it('should return tag when no old release tag exists', () => {
    vi.setSystemTime(new Date('2022-10-13'));
    const actualTag = getNewReleaseTag('v', 'yy.mm.dd.i', null);
    expect(actualTag).toBe('v22.10.13.01');
  });
  it.each(validTemplates)(
    'should return changed itr for same date for template: %s',
    (template) => {
      vi.setSystemTime(new Date('2022-10-13'));
      const { oldTag, expectedTag } = getTestCase({
        template,
        oldItr: 4,
        newItr: 5,
        prefix: 'v',
      });
      const actualTag = getNewReleaseTag('v', template, oldTag);
      expect(actualTag).toBe(expectedTag);
    }
  );
  it.each(validTemplates)(
    'should return reset itr for changed day for template: %s',
    (template) => {
      vi.setSystemTime(new Date('2022-10-13'));
      const { oldTag, expectedTag } = getTestCase({
        template,
        oldDate: new Date('2022-10-10'),
        oldItr: 4,
        newItr: template.includes(IAllowedTemplate.day) ? 1 : 5,
        prefix: 'abc',
      });
      const actualTag = getNewReleaseTag('abc', template, oldTag);
      expect(actualTag).toBe(expectedTag);
    }
  );
  it.each(validTemplates)(
    'should return reset itr for changed month for template: %s',
    (template) => {
      vi.setSystemTime(new Date('2022-10-12'));
      const { oldTag, expectedTag } = getTestCase({
        template,
        oldDate: new Date('2022-01-12'),
        oldItr: 1,
        newItr: template.includes(IAllowedTemplate.month) ? 1 : 2,
        prefix: 'v',
      });
      const actualTag = getNewReleaseTag('v', template, oldTag);
      expect(actualTag).toBe(expectedTag);
    }
  );
  it.each(validTemplates)(
    'should return reset itr for changed year for template: %s',
    (template) => {
      vi.setSystemTime(new Date('2023-09-28'));
      const { oldTag, expectedTag } = getTestCase({
        template,
        oldDate: new Date('2022-09-28'),
        oldItr: 41,
        newItr:
          template.includes(IAllowedTemplate.fullYear) ||
          template.includes(IAllowedTemplate.shortYear)
            ? 1
            : 42,
        prefix: '10',
      });
      const actualTag = getNewReleaseTag('10', template, oldTag);
      expect(actualTag).toBe(expectedTag);
    }
  );
  it.each(validTemplates)(
    'should return reset itr for changed month/year for template: %s',
    (template) => {
      vi.setSystemTime(new Date('2023-04-18'));
      const { oldTag, expectedTag } = getTestCase({
        template,
        oldDate: new Date('2022-11-18'),
        oldItr: 166,
        newItr:
          template.includes(IAllowedTemplate.fullYear) ||
          template.includes(IAllowedTemplate.shortYear) ||
          template.includes(IAllowedTemplate.month)
            ? 1
            : 167,
        prefix: '@',
      });
      const actualTag = getNewReleaseTag('@', template, oldTag);
      expect(actualTag).toBe(expectedTag);
    }
  );
  it.each(validTemplates)(
    'should return reset itr for changed date/month for template: %s',
    (template) => {
      vi.setSystemTime(new Date('2023-06-15'));
      const { oldTag, expectedTag } = getTestCase({
        template,
        oldDate: new Date('2023-03-25'),
        oldItr: 5,
        newItr:
          template.includes(IAllowedTemplate.day) ||
          template.includes(IAllowedTemplate.month)
            ? 1
            : 6,
        prefix: '__',
      });
      const actualTag = getNewReleaseTag('__', template, oldTag);
      expect(actualTag).toBe(expectedTag);
    }
  );
  it.each(validTemplates)(
    'should return reset itr for changed date/year for template: %s',
    (template) => {
      vi.setSystemTime(new Date('2023-12-11'));
      const { oldTag, expectedTag } = getTestCase({
        template,
        oldDate: new Date('2021-12-17'),
        oldItr: 12,
        newItr:
          template.includes(IAllowedTemplate.day) ||
          template.includes(IAllowedTemplate.fullYear) ||
          template.includes(IAllowedTemplate.shortYear)
            ? 1
            : 13,
        prefix: '_v_',
      });
      const actualTag = getNewReleaseTag('_v_', template, oldTag);
      expect(actualTag).toBe(expectedTag);
    }
  );
});

describe('test invalid cases', () => {
  it('should throw error for no template', () => {
    expect(() => getNewReleaseTag('v', null, 'v2023.10.1')).toThrowError(
      'Template not found'
    );
  });
  it('should throw error when old release doesnt start with prefix', () => {
    expect(() => getNewReleaseTag('v', 'yy.mm.i', '20.10.5')).toThrowError(
      'Old release tag "20.10.5" does not start with the tag prefix "v"'
    );
  });
  it.each(['yymmi', ...AllowedParts])(
    'should throw error when no separator is in template',
    (template) => {
      expect(() => getNewReleaseTag('', template, '20.10.5')).toThrowError(
        'Template must have a separator'
      );
    }
  );
  it('should throw error when template has >1 separator in template', () => {
    expect(() => getNewReleaseTag('', 'yy.mm-i', '20.10.5')).toThrowError(
      'Template cannot have more than one separator'
    );
  });
  it.each(['yymm.i', '-yy-mm-i', 'yy-mm-i-'])(
    'should throw error when template: %s and release tag doesnt match',
    (template) => {
      expect(() => getNewReleaseTag('', template, '20.10.5')).toThrowError(
        'Template does not represent last release tag'
      );
    }
  );
  it.each(['2023.ab.1', 'h2.z.1#2', '123123.@.', 'false.true. hg '])(
    'should throw error when template: %s and release tag doesnt match',
    (oldTag) => {
      expect(() => getNewReleaseTag('', 'yyyy.dd.i', oldTag)).toThrowError(
        /Old relese tag contains unsupported character:/
      );
    }
  );
});
