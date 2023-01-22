import { exportVariable, getInput, setFailed } from '@actions/core';
import { fetchLatestReleaseTag } from './services/githubService';
import getNewReleaseTag from './services/releaseService';

const generateNextReleaseTag = async (): Promise<void> => {
  try {
    const tagPrefix = getInput('tag_prefix');
    console.log('tag prefix: ', tagPrefix);
    const oldReleaseTag = await fetchLatestReleaseTag();
    const newReleaseTag = getNewReleaseTag(oldReleaseTag);

    console.log(`Previous Release Tag: ${oldReleaseTag}`);
    console.log(`New Release Tag: ${newReleaseTag}`);

    exportVariable('release_tag', newReleaseTag);
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
};

generateNextReleaseTag();
