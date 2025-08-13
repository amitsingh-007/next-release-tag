// eslint-disable-next-line no-warning-comments
// TODO: write tests
export const extractTagPrefix = (tagPrefix: string) => {
  const wildcardCount = tagPrefix.match(/\*/g)?.length;
  // If no wildcard is present, return the tagPrefix as is
  if (!wildcardCount) {
    return tagPrefix;
  }

  // If there's exactly one wildcard at the end, remove it and return the rest
  if (wildcardCount === 1 && tagPrefix.endsWith('*')) {
    return tagPrefix.slice(0, -1);
  }

  // If there are multiple wildcards or its not at the end, throw an error
  throw new Error(`Invalid tag prefix: ${tagPrefix}`);
};
