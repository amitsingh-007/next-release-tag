import { IAllowedTemplate } from '../../src/types';

const pad = (value: number) => String(value).padStart(2, '0');

const getReleaseTag = (template: string, date: Date, itr: number) =>
  template
    .replaceAll(IAllowedTemplate.fullYear, pad(date.getFullYear()))
    .replaceAll(IAllowedTemplate.shortYear, pad(date.getFullYear() % 100))
    .replaceAll(IAllowedTemplate.month, pad(date.getMonth() + 1))
    .replaceAll(IAllowedTemplate.day, pad(date.getDate()))
    .replaceAll(IAllowedTemplate.itr, pad(itr));

export const getTestCase = ({
  oldDate = new Date(),
  template,
  oldItr,
  newItr = 1,
  prefix = '',
}: {
  oldDate?: Date;
  template: string;
  oldItr: number;
  newItr?: number;
  prefix?: string;
}) => ({
  oldTag: `${prefix}${getReleaseTag(template, oldDate, oldItr)}`,
  expectedTag: `${prefix}${getReleaseTag(template, new Date(), newItr)}`,
});

// Covers each date token present/absent, so every itr-reset branch in
// getNewPartsData has both a hit and a miss. Replaces a 320-template permutation.
export const validTemplates = [
  'yy.i',
  'yyyy.i',
  'mm.i',
  'dd.i',
  'yy.mm.i',
  'yy.dd.i',
  'mm.dd.i',
  'yyyy.mm.dd.i',
];
