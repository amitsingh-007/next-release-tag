import { IAllowedTemplate, type IPartsData } from '../types';
import { parseTemplate } from './templateService';

const pad = (value: number) => String(value).padStart(2, '0');

const hasItemChanged = (old: number, cur: number) => old !== -1 && old !== cur;

const getNewPartsData = (partsData: IPartsData) => {
  const { oldFullYear, oldShortYear, oldMonth, oldDay, oldItr } = partsData;
  const curDate = new Date();
  const curFullYear = curDate.getFullYear();
  const curShortYear = curFullYear % 100;
  const curMonth = curDate.getMonth() + 1;
  const curDay = curDate.getDate();
  let newItr = oldItr + 1;
  if (
    hasItemChanged(oldFullYear, curFullYear) ||
    hasItemChanged(oldShortYear, curShortYear) ||
    hasItemChanged(oldMonth, curMonth) ||
    hasItemChanged(oldDay, curDay)
  ) {
    newItr = 1;
  }

  return {
    curFullYear,
    curShortYear,
    curMonth,
    curDay,
    newItr,
  };
};

export const getNewReleaseTag = (
  tagPrefix: string,
  tagTemplate: string | null | undefined,
  oldReleaseTag: string | null | undefined
) => {
  if (!tagTemplate) {
    throw new Error('Template not found');
  }

  const oldPartsData = parseTemplate(tagTemplate, oldReleaseTag, tagPrefix);
  const { curFullYear, curShortYear, curMonth, curDay, newItr } =
    getNewPartsData(oldPartsData);

  // `yyyy` must be substituted before `yy`, otherwise it would match first.
  const tag = tagTemplate
    .replaceAll(IAllowedTemplate.fullYear, pad(curFullYear))
    .replaceAll(IAllowedTemplate.shortYear, pad(curShortYear))
    .replaceAll(IAllowedTemplate.month, pad(curMonth))
    .replaceAll(IAllowedTemplate.day, pad(curDay))
    .replaceAll(IAllowedTemplate.itr, pad(newItr));

  return `${tagPrefix}${tag}`;
};
