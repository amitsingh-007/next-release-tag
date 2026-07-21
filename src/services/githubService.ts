import { getInput } from '@actions/core';
import { context, getOctokit } from '@actions/github';

export const fetchLatestReleaseTag = async () => {
  try {
    const githubToken = getInput('github_token', { required: true });
    const octokit = getOctokit(githubToken);
    const { owner, repo } = context.repo;
    // Fetch only latest tag
    const response = await octokit.rest.repos.listTags({
      owner,
      repo,
      page: 1,
      per_page: 1,
    });
    return response.data?.at(0)?.name;
  } catch (error) {
    console.error('Error while fetching tags list for this repository', error);
    throw error;
  }
};

export const fetchLatestMatchingTag = async (pattern: string) => {
  const githubToken = getInput('github_token', { required: true });
  const octokit = getOctokit(githubToken);
  const { owner, repo } = context.repo;

  // This endpoint returns all matching tags in a single response; it ignores
  // the per_page/page pagination parameters (see github/docs issue #3863).
  const response = await octokit.rest.git.listMatchingRefs({
    owner,
    repo,
    ref: `tags/${pattern}`,
  });

  // Refs come back in lexicographic order, so re-sort numerically to find the
  // true latest tag (e.g. v1.10 > v1.9 and ...100 > ...99).
  const tags = response.data
    .map((entry) => entry.ref.split('/').pop())
    .filter((tag): tag is string => tag !== undefined)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  return tags.at(-1);
};
