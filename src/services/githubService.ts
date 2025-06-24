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
