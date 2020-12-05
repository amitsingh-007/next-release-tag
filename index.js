const core = require("@actions/core");
const github = require("@actions/github");

const generateNewTagFromOld = (oldYear, oldMonth, oldItr) => {
  const curDate = new Date();
  const curMonth = curDate.getMonth() + 1;
  const curYear = curDate.getFullYear() % 100;
  let newYear = curYear;
  let newMonth = curMonth;
  let newItr = oldItr + 1;
  if (curMonth !== oldMonth) {
    newItr = 1;
    newMonth = curMonth;
  }
  if (curYear != oldYear) {
    newYear = curYear;
  }
  return `v${newYear}.${newMonth}.${newItr}`;
};

const getNewReleaseTag = (oldReleaseTag) => {
  if (oldReleaseTag && oldReleaseTag.startsWith("v")) {
    const [oldYear, oldMonth, oldItr] = oldReleaseTag
      .substring(1)
      .split(".")
      .map((x) => Number(x));
    return generateNewTagFromOld(oldYear, oldMonth, oldItr);
  }
  return generateNewTagFromOld(-1, -1, -1);
};

const generateNextReleaseTag = async () => {
  try {
    const github_token = core.getInput("github_token");
    const octokit = github.getOctokit(github_token);
    const { owner, repo } = github.context.repo;
    const response = await octokit.repos.getLatestRelease({
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
