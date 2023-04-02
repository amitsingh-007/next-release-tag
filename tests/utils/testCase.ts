import { IAllowedTemplate } from '../../src/types';

const getReleaseTag = (template: string, date: Date, itr: number) =>
  template
    .replaceAll(IAllowedTemplate.fullYear, date.getFullYear().toString())
    .replaceAll(
      IAllowedTemplate.shortYear,
      (date.getFullYear() % 100).toString()
    )
    .replaceAll(IAllowedTemplate.month, (date.getMonth() + 1).toString())
    .replaceAll(IAllowedTemplate.day, date.getDate().toString())
    .replaceAll(IAllowedTemplate.itr, itr.toString());

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
