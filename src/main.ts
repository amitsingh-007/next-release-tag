import { getInput, setFailed, setOutput } from '@actions/core';
import {
  fetchLatestMatchingTag,
  fetchLatestReleaseTag,
} from './services/githubService';
import { getNewReleaseTag } from './services/releaseService';
import { extractTagPrefix } from './utils';

export const resolvePreviousTag = async (tagPrefixInput: string) => {
  const previousTagOverride = getInput('previous_tag');

  // If a previous tag is provided, use it
  if (previousTagOverride) {
    return previousTagOverride;
  }

  // extractTagPrefix only shortens the input when a trailing wildcard was
  // present, so an unchanged value means there was no wildcard.
  const tagPrefix = extractTagPrefix(tagPrefixInput);
  return tagPrefix === tagPrefixInput
    ? fetchLatestReleaseTag()
    : fetchLatestMatchingTag(tagPrefix);
};

export const run = async (): Promise<void> => {
  try {
    const tagPrefixInput = getInput('tag_prefix');
    const tagTemplate = getInput('tag_template');
    const previousTagOverride = await resolvePreviousTag(tagPrefixInput);

    const newReleaseTag = getNewReleaseTag(
      extractTagPrefix(tagPrefixInput),
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
