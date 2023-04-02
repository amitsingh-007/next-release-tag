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
  oldTag: string,
  separator: string
): IPartsData => {
  const templateParts = template.split(separator);
  const oldTagParts = oldTag.split(separator);
  if (templateParts.length !== oldTagParts.length) {
    throw new Error('Template does not represent last release tag');
  }
  const partsData = {
    separator,
    oldFullYear: -1,
    oldShortYear: -1,
    oldMonth: -1,
    oldDay: -1,
    oldItr: -1,
  };
  templateParts.forEach((x, index) => {
    const oldTagPartStr = oldTagParts[index];
    if (!oldTagPartStr || Number.isNaN(parseInt(oldTagPartStr, 10))) {
      throw new Error(
        `Old relese tag contains unsupported character: ${oldTagPartStr}`
      );
    }
    const oldTagPart = Number(oldTagPartStr);
    switch (x) {
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
        throw new Error(`Template contains unrecognized character: ${x}`);
    }
  });
  return partsData;
};

export const parseTemplate = (
  template: string,
  oldTag: string,
  tagPrefix: string
) => {
  const separator = getSeparator(template);
  return parse(template, oldTag.substring(tagPrefix.length), separator);
};
