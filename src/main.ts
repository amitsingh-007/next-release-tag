import { getInput, setFailed, setOutput } from '@actions/core';
import {
  fetchLatestMatchingTag,
  fetchLatestReleaseTag,
} from './services/githubService';
import { getNewReleaseTag } from './services/releaseService';
import { extractTagPrefix } from './utils';

export const resolvePreviousTag = async (
  tagPrefix: string,
  isWildcard: boolean
) => {
  const previousTagOverride = getInput('previous_tag');

  // If a previous tag is provided, use it
  if (previousTagOverride) {
    return previousTagOverride;
  }

  // If its a prefix wildcard then fetch the latest matching tag
  if (isWildcard) {
    return fetchLatestMatchingTag(tagPrefix);
  }

  // If its a normal tag then fetch the latest release tag
  return fetchLatestReleaseTag();
};

export const run = async (): Promise<void> => {
  try {
    const tagPrefixInput = getInput('tag_prefix');
    const tagTemplate = getInput('tag_template');
    const tagPrefix = extractTagPrefix(tagPrefixInput);
    const previousTagOverride = await resolvePreviousTag(
      tagPrefix,
      tagPrefixInput.endsWith('*')
    );

    const newReleaseTag = getNewReleaseTag(
      tagPrefix,
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
      setFailed(JSON.stringify(error_));
    }
  }
};
