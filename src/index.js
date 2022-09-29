import { getInput, exportVariable, setFailed } from "@actions/core";
import { getOctokit, context } from "@actions/github";
import getNewReleaseTag from "./getReleaseTag";

const generateNextReleaseTag = async () => {
  try {
    const github_token = getInput("github_token");
    const octokit = getOctokit(github_token);
    const { owner, repo } = context.repo;
    console.log("Before call");
    const response = await octokit.rest.repos.getLatestRelease({
      owner,
      repo,
    });
    console.log("Response", response);
    const { tag_name: oldReleaseTag } = response.data;
    const newReleaseTag = getNewReleaseTag(oldReleaseTag);
    console.log(`Previous Release Tag: ${oldReleaseTag}`);
    console.log(`New Release Tag: ${newReleaseTag}`);
    exportVariable("release_tag", newReleaseTag);
  } catch (error) {
    setFailed(error);
  }
};

generateNextReleaseTag();
