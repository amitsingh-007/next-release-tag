import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchLatestReleaseTag,
  fetchLatestMatchingTag,
} from '../src/services/githubService';

const mocks = vi.hoisted(() => ({
  getInput: vi.fn<(name: string) => string>(),
  listTags: vi.fn(),
  listMatchingRefs: vi.fn(),
  getOctokit: vi.fn(),
}));

vi.mock('@actions/core', () => ({
  getInput: mocks.getInput,
}));

vi.mock('@actions/github', () => ({
  getOctokit: mocks.getOctokit,
  context: { repo: { owner: 'acme', repo: 'widgets' } },
}));

beforeEach(() => {
  mocks.getInput.mockReturnValue('fake-token');
  mocks.getOctokit.mockReturnValue({
    rest: {
      repos: { listTags: mocks.listTags },
      git: { listMatchingRefs: mocks.listMatchingRefs },
    },
  });
});

afterEach(() => {
  vi.resetAllMocks();
});

describe('fetchLatestReleaseTag', () => {
  it('returns the first tag name and requests only the latest tag', async () => {
    mocks.listTags.mockResolvedValue({ data: [{ name: 'v3.2.1' }] });

    await expect(fetchLatestReleaseTag()).resolves.toBe('v3.2.1');
    expect(mocks.listTags).toHaveBeenCalledWith({
      owner: 'acme',
      repo: 'widgets',
      page: 1,
      per_page: 1,
    });
  });

  it('returns undefined when the tag list is empty', async () => {
    mocks.listTags.mockResolvedValue({ data: [] });
    await expect(fetchLatestReleaseTag()).resolves.toBeUndefined();
  });

  it('propagates API errors', async () => {
    mocks.listTags.mockRejectedValue(new Error('rate limited'));
    await expect(fetchLatestReleaseTag()).rejects.toThrow('rate limited');
  });
});

describe('fetchLatestMatchingTag', () => {
  it('queries tags/<pattern> and returns the latest tag', async () => {
    mocks.listMatchingRefs.mockResolvedValue({
      data: [
        { ref: 'refs/tags/v1.0' },
        { ref: 'refs/tags/v1.1' },
        { ref: 'refs/tags/v1.2' },
      ],
    });

    await expect(fetchLatestMatchingTag('v')).resolves.toBe('v1.2');
    // The endpoint ignores pagination params, so none are sent.
    expect(mocks.listMatchingRefs).toHaveBeenCalledWith({
      owner: 'acme',
      repo: 'widgets',
      ref: 'tags/v',
    });
  });

  it('returns undefined when there are no matching refs', async () => {
    mocks.listMatchingRefs.mockResolvedValue({ data: [] });
    await expect(fetchLatestMatchingTag('v')).resolves.toBeUndefined();
  });

  it('propagates API errors', async () => {
    mocks.listMatchingRefs.mockRejectedValue(new Error('boom'));
    await expect(fetchLatestMatchingTag('v')).rejects.toThrow('boom');
  });

  it('picks the numerically-latest tag, not the lexicographic one', async () => {
    // Lexicographically v1.10 < v1.9, but numerically v1.10 is newer.
    mocks.listMatchingRefs.mockResolvedValue({
      data: [{ ref: 'refs/tags/v1.10' }, { ref: 'refs/tags/v1.9' }],
    });

    await expect(fetchLatestMatchingTag('v')).resolves.toBe('v1.10');
  });

  it('handles iteration-width boundaries (100 beats 99)', async () => {
    mocks.listMatchingRefs.mockResolvedValue({
      data: [
        { ref: 'refs/tags/v2024.06.21.99' },
        { ref: 'refs/tags/v2024.06.21.100' },
      ],
    });

    await expect(fetchLatestMatchingTag('v')).resolves.toBe('v2024.06.21.100');
  });

  it('sorts client-side regardless of the order refs are returned', async () => {
    mocks.listMatchingRefs.mockResolvedValue({
      data: [
        { ref: 'refs/tags/v1.10' },
        { ref: 'refs/tags/v1.2' },
        { ref: 'refs/tags/v1.9' },
      ],
    });

    await expect(fetchLatestMatchingTag('v')).resolves.toBe('v1.10');
  });
});
