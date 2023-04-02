export const IAllowedTemplate = {
  fullYear: 'yyyy',
  shortYear: 'yy',
  month: 'mm',
  day: 'dd',
  itr: 'i',
} as const;

export const AllowedParts = Object.values(IAllowedTemplate);
