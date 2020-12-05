const core = require("@actions/core");
const github = require("@actions/github");

const generateNextReleaseTag = async () => {
  try {
    const github_token = core.getInput("github_token");
    const octokit = github.getOctokit(github_token);
    const { owner, repo } = github.context.repo;
    const { name, tag_name } = await octokit.repos.getLatestRelease({
      owner,
      repo,
    });
    console.log(`name: ${name}`);
    console.log(`tag_name: ${tag_name}`);
    core.setOutput("previous_tag", tag_name);
    core.setOutput("new_tag", tag_name);
    core.exportVariable("release_tag", tag_name);
  } catch (error) {
    core.setFailed(error.message);
  }
};
generateNextReleaseTag();
