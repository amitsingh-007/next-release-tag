const core = require("@actions/core");
const github = require("@actions/github");
const getNewReleaseTag = require("./getReleaseTag");

const generateNextReleaseTag = async () => {
  try {
    const github_token = core.getInput("github_token");
    const octokit = github.getOctokit(github_token);
    const { owner, repo } = github.context.repo;
    const response = await octokit.rest.repos.getLatestRelease({
      owner,
      repo,
    });
    const { tag_name: oldReleaseTag } = response.data;
    const newReleaseTag = getNewReleaseTag(oldReleaseTag);
    console.log(`Previous Release Tag: ${oldReleaseTag}`);
    console.log(`New Release Tag: ${newReleaseTag}`);
    core.exportVariable("release_tag", newReleaseTag);
  } catch (error) {
    core.setFailed(error.message);
  }
};

generateNextReleaseTag();
