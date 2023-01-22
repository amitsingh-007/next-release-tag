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
  let newYear = curYear;
  let newMonth = curMonth;
  let newItr = oldItr + 1;
  if (curMonth !== oldMonth) {
    newItr = 1;
    newMonth = curMonth;
  }
  if (curYear !== oldYear) {
    newYear = curYear;
  }
  return `${tagPrefix}${newYear}.${newMonth}.${newItr}`;
};
