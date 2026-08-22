import { AllowedParts, IAllowedTemplate, type IPartsData } from '../types';

const PART_TO_FIELD: Record<string, keyof IPartsData | undefined> = {
  [IAllowedTemplate.fullYear]: 'oldFullYear',
  [IAllowedTemplate.shortYear]: 'oldShortYear',
  [IAllowedTemplate.month]: 'oldMonth',
  [IAllowedTemplate.day]: 'oldDay',
  [IAllowedTemplate.itr]: 'oldItr',
};

const getSeparator = (template: string) => {
  const withOnlySeparators = AllowedParts.reduce(
    (acc, curVal) => acc.replaceAll(curVal, ''),
    template
  );
  const separators = new Set(withOnlySeparators);
  if (separators.size === 0) {
    throw new Error('Template must have a separator');
  }

  if (separators.size !== 1) {
    throw new Error('Template cannot have more than one separator');
  }

  return withOnlySeparators[0];
};

export const parseTemplate = (
  template: string,
  oldReleaseTag: string | null | undefined,
  tagPrefix: string
): IPartsData => {
  const separator = getSeparator(template);
  const partsData = {
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

  const oldTag = oldReleaseTag.slice(tagPrefix.length);
  const templateParts = template.split(separator);
  const oldTagParts = oldTag.split(separator);
  if (templateParts.length !== oldTagParts.length) {
    throw new Error('Template does not represent last release tag');
  }

  templateParts.forEach((part, index) => {
    const oldTagPartStr = oldTagParts[index];
    if (!oldTagPartStr || Number.isNaN(Number.parseInt(oldTagPartStr, 10))) {
      throw new Error(
        `Old release tag contains unsupported character: ${oldTagPartStr}`
      );
    }

    const field = PART_TO_FIELD[part];
    if (!field) {
      throw new Error(`Template contains unrecognized character: ${part}`);
    }

    partsData[field] = Number(oldTagPartStr);
  });
  return partsData;
};
