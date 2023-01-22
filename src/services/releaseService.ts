import { generateNewTagFromOld } from '../utils/release';

const getNewReleaseTag = (
  tagPrefix: string,
  oldReleaseTag: string | null | undefined
) => {
  if (oldReleaseTag && oldReleaseTag.startsWith(tagPrefix)) {
    const [oldYear, oldMonth, oldItr] = oldReleaseTag
      .substring(tagPrefix.length)
      .split('.')
      .map((x) => Number(x));
    return generateNewTagFromOld({
      oldYear,
      oldMonth,
      oldItr,
      tagPrefix,
    });
  }
  // Handle no releases yet or prefix not matching last release
  return generateNewTagFromOld({
    oldYear: -1,
    oldMonth: -1,
    oldItr: -1,
    tagPrefix,
  });
};

export default getNewReleaseTag;
