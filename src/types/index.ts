export const IAllowedTemplate = {
  fullYear: 'yyyy',
  shortYear: 'yy',
  month: 'mm',
  day: 'dd',
  itr: 'i',
} as const;

export const AllowedParts = Object.values(IAllowedTemplate);

export interface IPartsData {
  oldFullYear: number;
  oldShortYear: number;
  oldMonth: number;
  oldDay: number;
  oldItr: number;
}
