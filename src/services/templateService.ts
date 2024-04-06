import { AllowedParts, IAllowedTemplate } from '../types';
import { IPartsData } from '../types/template';

const getSeparator = (template: string) => {
  const withOnlySeparators = AllowedParts.reduce(
    (acc, curVal) => acc.replaceAll(curVal, ''),
    template
  );
  const separators = new Set(withOnlySeparators.split(''));
  if (separators.size === 0) {
    throw new Error('Template must have a separator');
  }
  if (separators.size !== 1) {
    throw new Error('Template cannot have more than one separator');
  }
  return withOnlySeparators[0];
};

const parse = (
  template: string,
  oldReleaseTag: string | null | undefined,
  separator: string,
  tagPrefix: string
): IPartsData => {
  const partsData = {
    separator,
    oldFullYear: -1,
    oldShortYear: -1,
    oldMonth: -1,
    oldDay: -1,
    oldItr: -1,
  };
  if (!oldReleaseTag) {
    partsData.oldItr = 0;
    return partsData;
  }
  if (!oldReleaseTag.startsWith(tagPrefix)) {
    throw new Error(
      `Old release tag "${oldReleaseTag}" does not start with the tag prefix "${tagPrefix}"`
    );
  }

  const oldTag = oldReleaseTag.substring(tagPrefix.length);
  const templateParts = template.split(separator);
  const oldTagParts = oldTag.split(separator);
  if (templateParts.length !== oldTagParts.length) {
    throw new Error('Template does not represent last release tag');
  }

  templateParts.forEach((part, index) => {
    const oldTagPartStr = oldTagParts[index];
    if (!oldTagPartStr || Number.isNaN(parseInt(oldTagPartStr, 10))) {
      throw new Error(
        `Old relese tag contains unsupported character: ${oldTagPartStr}`
      );
    }
    const oldTagPart = Number(oldTagPartStr);
    switch (part) {
      case IAllowedTemplate.fullYear:
        partsData.oldFullYear = oldTagPart;
        break;
      case IAllowedTemplate.shortYear:
        partsData.oldShortYear = oldTagPart;
        break;
      case IAllowedTemplate.month:
        partsData.oldMonth = oldTagPart;
        break;
      case IAllowedTemplate.day:
        partsData.oldDay = oldTagPart;
        break;
      case IAllowedTemplate.itr:
        partsData.oldItr = oldTagPart;
        break;
      default:
        throw new Error(`Template contains unrecognized character: ${part}`);
    }
  });
  return partsData;
};

export const parseTemplate = (
  template: string,
  oldTag: string | null | undefined,
  tagPrefix: string
) => {
  const separator = getSeparator(template);
  return parse(template, oldTag, separator, tagPrefix);
};
