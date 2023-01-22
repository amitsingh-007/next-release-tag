import { getInput } from '@actions/core';
import { context, getOctokit } from '@actions/github';

export const fetchLatestReleaseTag = async () => {
  try {
    const githubToken = getInput('github_token', { required: true });
    const octokit = getOctokit(githubToken);
    const { owner, repo } = context.repo;
    const response = await octokit.rest.repos.getLatestRelease({
      owner,
      repo,
    });
    return response.data.tag_name;
  } catch (error: any) {
    // No releases yet
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
};
