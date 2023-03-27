export const generateNewTagFromOld = ({
  oldYear,
  oldMonth,
  oldItr,
  tagPrefix,
}: {
  oldYear: number;
  oldMonth: number;
  oldItr: number;
  tagPrefix: string;
}) => {
  const curDate = new Date();
  const curMonth = curDate.getMonth() + 1;
  const curYear = curDate.getFullYear() % 100;
  let newItr = oldItr + 1;
  if (curMonth !== oldMonth || curYear !== oldYear) {
    newItr = 1;
  }
  return `${tagPrefix}${curYear}.${curMonth}.${newItr}`;
};
