import { IAllowedTemplate } from '../types';
import { IPartsData } from '../types/template';
import { parseTemplate } from './templateService';

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

const generateNewTagFromOld = (
  partsData: IPartsData,
  tagTemplate: string,
  tagPrefix: string
) => {
  const { curFullYear, curShortYear, curMonth, curDay, newItr } =
    getNewPartsData(partsData);
  const newReleaseTag = tagTemplate
    .replaceAll(IAllowedTemplate.fullYear, curFullYear.toString())
    .replaceAll(IAllowedTemplate.shortYear, curShortYear.toString())
    .replaceAll(IAllowedTemplate.month, curMonth.toString())
    .replaceAll(IAllowedTemplate.day, curDay.toString())
    .replaceAll(IAllowedTemplate.itr, newItr.toString());
  return `${tagPrefix}${newReleaseTag}`;
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
  return generateNewTagFromOld(oldPartsData, tagTemplate, tagPrefix);
};
