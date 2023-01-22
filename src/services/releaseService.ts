import { generateNewTagFromOld } from '../utils/release';

const getNewReleaseTag = (oldReleaseTag: string | null | undefined) => {
  if (oldReleaseTag && oldReleaseTag.startsWith('v')) {
    const [oldYear, oldMonth, oldItr] = oldReleaseTag
      .substring(1)
      .split('.')
      .map((x) => Number(x));
    return generateNewTagFromOld(oldYear, oldMonth, oldItr);
  }
  return generateNewTagFromOld(-1, -1, -1);
};

export default getNewReleaseTag;
