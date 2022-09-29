import { getInput } from "@actions/core";
import { getOctokit, context } from "@actions/github";

export const fetchLatestReleaseTag = async () => {
  try {
    const github_token = getInput("github_token");
    const octokit = getOctokit(github_token);
    const { owner, repo } = context.repo;
    const response = await octokit.rest.repos.getLatestRelease({
      owner,
      repo,
    });
    return response.data.tag_name;
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
    throw error;
  }
};
