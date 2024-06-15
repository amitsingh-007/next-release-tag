import { IAllowedTemplate } from '../../src/types';

const format = (value: number) => (value < 10 ? `0${value}` : `${value}`);

const getReleaseTag = (template: string, date: Date, itr: number) =>
  template
    .replaceAll(IAllowedTemplate.fullYear, format(date.getFullYear()))
    .replaceAll(IAllowedTemplate.shortYear, format(date.getFullYear() % 100))
    .replaceAll(IAllowedTemplate.month, format(date.getMonth() + 1))
    .replaceAll(IAllowedTemplate.day, format(date.getDate()))
    .replaceAll(IAllowedTemplate.itr, format(itr));

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
