import { exportVariable, setFailed } from "@actions/core";
import fetchLatestReleaseTag from "./fetchLatestReleaseTag";
import getNewReleaseTag from "./getReleaseTag";

const generateNextReleaseTag = async () => {
  try {
    const oldReleaseTag = await fetchLatestReleaseTag();
    const newReleaseTag = getNewReleaseTag(oldReleaseTag);
    console.log(`Previous Release Tag: ${oldReleaseTag}`);
    console.log(`New Release Tag: ${newReleaseTag}`);
    exportVariable("release_tag", newReleaseTag);
  } catch (error) {
    setFailed(error.message);
  }
};

generateNextReleaseTag();
