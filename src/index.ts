import { getInput, setFailed, setOutput, error } from '@actions/core';
import {
  fetchLatestMatchingTag,
  fetchLatestReleaseTag,
} from './services/githubService';
import { getNewReleaseTag } from './services/releaseService';
import { extractTagPrefix } from './utils';

const resolvePreviousTag = async (tagPrefix: string) => {
  const previousTagOverride = getInput('previous_tag');

  // If a previous tag is provided, use it
  if (previousTagOverride) {
    return previousTagOverride;
  }

  // If its a prefix wildcard then fetch the latest matching tag
  if (tagPrefix.endsWith('*')) {
    return fetchLatestMatchingTag(extractTagPrefix(tagPrefix));
  }

  // If its a normal tag then fetch the latest release tag
  return fetchLatestReleaseTag();
};

const generateNextReleaseTag = async (): Promise<void> => {
  try {
    const tagPrefix = getInput('tag_prefix');
    const tagTemplate = getInput('tag_template');
    const previousTagOverride = await resolvePreviousTag(tagPrefix);

    const newReleaseTag = getNewReleaseTag(
      extractTagPrefix(tagPrefix),
      tagTemplate,
      previousTagOverride
    );

    console.log(`Previous Release Tag: ${previousTagOverride}`);
    console.log(`New Release Tag: ${newReleaseTag}`);

    setOutput('prev_release_tag', previousTagOverride);
    setOutput('next_release_tag', newReleaseTag);
  } catch (error_) {
    if (error_ instanceof Error) {
      setFailed(error_.message);
    } else {
      error(JSON.stringify(error_));
    }
  }
};

void generateNextReleaseTag();
