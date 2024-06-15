import { IAllowedTemplate } from '../types';
import { IPartsData } from '../types/template';
import TagBuilder from './tagBuilder';
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

  return new TagBuilder(tagTemplate)
    .inject(IAllowedTemplate.fullYear, curFullYear)
    .inject(IAllowedTemplate.shortYear, curShortYear)
    .inject(IAllowedTemplate.month, curMonth)
    .inject(IAllowedTemplate.day, curDay)
    .inject(IAllowedTemplate.itr, newItr)
    .addPrefix(tagPrefix)
    .build();
};
