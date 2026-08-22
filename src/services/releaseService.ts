import { IAllowedTemplate } from '../types';
import { parseTemplate } from './templateService';

const pad = (value: number) => String(value).padStart(2, '0');

const hasItemChanged = (old: number, cur: number) => old !== -1 && old !== cur;

export const getNewReleaseTag = (
  tagPrefix: string,
  tagTemplate: string | null | undefined,
  oldReleaseTag: string | null | undefined
) => {
  if (!tagTemplate) {
    throw new Error('Template not found');
  }

  const old = parseTemplate(tagTemplate, oldReleaseTag, tagPrefix);
  const now = new Date();
  const fullYear = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  // Only date parts the template actually carries can reset the iteration;
  // parseTemplate leaves the absent ones at -1.
  const dateChanged =
    hasItemChanged(old.oldFullYear, fullYear) ||
    hasItemChanged(old.oldShortYear, fullYear % 100) ||
    hasItemChanged(old.oldMonth, month) ||
    hasItemChanged(old.oldDay, day);

  // `yyyy` must be substituted before `yy`, otherwise it would match first.
  const tag = tagTemplate
    .replaceAll(IAllowedTemplate.fullYear, pad(fullYear))
    .replaceAll(IAllowedTemplate.shortYear, pad(fullYear % 100))
    .replaceAll(IAllowedTemplate.month, pad(month))
    .replaceAll(IAllowedTemplate.day, pad(day))
    .replaceAll(IAllowedTemplate.itr, pad(dateChanged ? 1 : old.oldItr + 1));

  return `${tagPrefix}${tag}`;
};
