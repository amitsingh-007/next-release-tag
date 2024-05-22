import { getInput, setFailed, setOutput } from '@actions/core';
import { fetchLatestReleaseTag } from './services/githubService';
import { getNewReleaseTag } from './services/releaseService';

const generateNextReleaseTag = async (): Promise<void> => {
  try {
    const tagPrefix = getInput('tag_prefix');
    const tagTemplate = getInput('tag_template');
    const oldReleaseTag = getInput('previous_tag') || await fetchLatestReleaseTag();
    const newReleaseTag = getNewReleaseTag(
      tagPrefix,
      tagTemplate,
      oldReleaseTag
    );

    console.log(`Previous Release Tag: ${oldReleaseTag}`);
    console.log(`New Release Tag: ${newReleaseTag}`);

    setOutput('prev_release_tag', oldReleaseTag);
    setOutput('next_release_tag', newReleaseTag);
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
};

generateNextReleaseTag();
